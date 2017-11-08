package handlers

import (
	"net/http"
	"fmt"
	"log"
	"bytes"
	"strings"
	"io"
	"os"
	"strconv"
	"github.com/imbaky/PatientFocus/core/domain/model"
	"github.com/imbaky/PatientFocus/core/configuration"
	"github.com/imbaky/PatientFocus/core/data"
	"encoding/json"
	"archive/zip"
)


func ReceiveDocument(rw http.ResponseWriter, req *http.Request) {
	//1. get file from request
	var buf bytes.Buffer
	file, header, err := req.FormFile("file") //the key must be "file" and the value is the actual file.
	defer file.Close()
	if err != nil {
		log.Fatal(err)
		fmt.Printf("%v \n",err)
		sendBoolResponse(rw,err)
		return
	}
	name := strings.Split(header.Filename, ".")
	fmt.Printf("File name %s\n", name[0])
	io.Copy(&buf, file)
	//2. get current user id from jwt token
	tkn := strings.Replace(req.Header.Get("Authorization"), "Bearer ", "", -1)
	id, err := data.GetIdFromSession(tkn)
	if err != nil {
		fmt.Printf("%v \n",err)
	}
	user := model.User{}
	user.Id = id
	err = data.GetUser(&user)
	if err != nil {
		fmt.Printf("%v \n",err)
		http.Error(rw, "", http.StatusNotFound);
		return;
	}
	//3. Create directory for patient/doctor if it does not already exist
	var fileDir = ""
	createFileDestination(&fileDir, user)
	err = os.Mkdir(fileDir, 0777)
	if err != nil {
		if(err.Error() != "mkdir " + fileDir + ": file exists") { //skip the case where directory already exists
			fmt.Printf("%v \n",err.Error())
			http.Error(rw, "Error creating user directory", http.StatusInternalServerError);
			return;
		}
	}
	//4. Save file in directory
	fileUrl := fileDir + "/" + header.Filename
	var osFile, osErr = os.Create(fileUrl)
	defer osFile.Close()
	if osErr != nil {
		fmt.Printf("There was a problem writing the file to " + fileUrl + "\n")
		panic(err)
		sendBoolResponse(rw,err)
		return
	}
	osFile.Write(buf.Bytes())
	buf.Reset()
	//5. create document model
	var document model.Document
	document.Url = fileUrl
	//6. insert document url in database
	err = data.InsertPatientDocument(document, *user.Patient)
	if err != nil {
		fmt.Printf("%v \n", err)
		sendBoolResponse(rw,err)
		return
	}
	sendBoolResponse(rw,err)
}

// form expected from frontend for document share
type DocSharePayload struct {
	Email 		string    `json:"email"`
	Mesage  	string    `json:"message"`
	Documents   []int  `json:"documents"`
}

const zipFileName = "share.zip"

// Patient shares docuement with doctor
func ShareDocument(rw http.ResponseWriter, req *http.Request) {
	// initialization
	var docSharePayload DocSharePayload
	var user model.User

	err := json.NewDecoder(req.Body).Decode(&docSharePayload)
	// convert array to string array
	var documentsArray []string
	for _, i := range docSharePayload.Documents {
		documentsArray = append(documentsArray, strconv.Itoa(i))
	}

	// look up doctor by email
	user.Email = docSharePayload.Email
	err = data.GetUserByEmail(&user)
	if err != nil {
		// return 404
		rw.WriteHeader(http.StatusNotFound)
		rw.Write([]byte(err.Error()))
		return
	}
	// get id
	if user.Doctor == nil {
		rw.WriteHeader(http.StatusNotFound)
		rw.Write([]byte("Doctor does not exist"))
		return
	}
	// verify document ids
	var documents []model.Document
	err = data.GetDocumentsFromArray(documentsArray, &documents)
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("Error retrieving documents from database"))
		return
	}
	// check lengths
	if len(documents) != len(documentsArray) {
		rw.WriteHeader(http.StatusNotFound)
		rw.Write([]byte("One or more documents do not exist"))
		return
	}
	// share documents
	err = data.LinkDoctorDocument(user, documents)
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("Error sharing documents"))
		return
	}

	return
}

//TODO use jwt token to get doctor
type userIds struct {
	DoctorId int    `json:"doctorId"`
	PatientId int    `json:"patientId"`
}

func GetSharedDocuments(rw http.ResponseWriter, req *http.Request) {
	var ids userIds
	err := json.NewDecoder(req.Body).Decode(&ids)
	defer req.Body.Close()
	if err != nil {
		fmt.Printf("%v", err)
		sendBoolResponse(rw, err)
		return
	}
	userPatient := model.User{}
	patient := model.Patient{}
	userPatient.Patient = &patient
	userPatient.Patient.Id = ids.PatientId
	userDoctor := model.User{}
	doctor := model.Doctor{}
	userDoctor.Doctor = &doctor
	userDoctor.Doctor.Id = ids.DoctorId
	var urls = []string{}
	err = data.GetSharedDocuments(&userDoctor, &userPatient, &urls)
	if err != nil {
		fmt.Printf("%v \n", err)
		http.Error(rw, "Documents not found", http.StatusNotFound);
		return
	}
	var zipDirectory = configuration.DirectoryForUploadedDocs + "doctor-" + strconv.Itoa(userDoctor.Doctor.Id )+
		"/" + "patient" + strconv.Itoa(userPatient.Patient.Id)
	os.MkdirAll(zipDirectory, 0777)
	var zipFiePath = zipDirectory + "/" + zipFileName
	zipFile, err := os.Create(zipFiePath)
	defer zipFile.Close()
	if err != nil {
		fmt.Printf("%v \n", err)
		http.Error(rw, "Zip file could not be created", http.StatusInternalServerError);
		return
	}
	// Create a new zip archive.
	zipWriter := zip.NewWriter(zipFile)
	createZip(zipWriter, urls)
	var contentDisposition string = "attachment; filename=" + "'" + zipFileName + "'"
	rw.Header().Set("Content-Type", "application/zip")
	rw.Header().Set("Content-Disposition", contentDisposition)
	http.ServeFile(rw, req, zipFiePath)
	os.RemoveAll(zipDirectory)
	os.Remove(configuration.DirectoryForUploadedDocs + "doctor-" + strconv.Itoa(userDoctor.Doctor.Id ))
}

func createZip(zipWriter *zip.Writer, urls []string) {
	defer zipWriter.Close()
	for _, url := range urls {
		file, err := os.Open(url)
		if err != nil {
			fmt.Printf("%v \n", err) //file not found
			continue;
		}
		defer file.Close()
		// Get the file information
		info, err := file.Stat()
		if err != nil {
			fmt.Printf("%v \n", err)
			continue;
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			fmt.Printf("%v \n", err)
			continue;
		}
		header.Method = zip.Deflate

		writer, err := zipWriter.CreateHeader(header)
		if err != nil {
			fmt.Printf("%v \n", err)
			continue;
		}
		_, err = io.Copy(writer, file)
		if err != nil {
			fmt.Printf("%v \n", err) //file not found
			continue;
		}
	}
}


type Session struct{ //temperary session wrapper to store user id. Needs to be deleted later once sessions are implemented
	patient_id string
}

func createFileDestination(fileDir *string, user model.User) {
	if user.Patient != nil { //create patient directory
		*fileDir = configuration.DirectoryForUploadedDocs + "patient-" + strconv.Itoa(user.Patient.Id)
	} else { //create doctor directory
		*fileDir = configuration.DirectoryForUploadedDocs + "doctor-" + strconv.Itoa(user.Doctor.Id)
	}
}
