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
	"path/filepath"
	"bufio"
)


func ReceiveDocument(rw http.ResponseWriter, req *http.Request) {

	var document model.Document
	var buf bytes.Buffer
	file, header, err := req.FormFile("file") //the key must be "file" and the value is the actual file.
	defer file.Close()
	if err != nil {
		log.Fatal(err)
		fmt.Printf("%v",err)
		panic(err)
		sendBoolResponse(rw,err)
		return
	}
	name := strings.Split(header.Filename, ".")
	fmt.Printf("File name %s\n", name[0])
	io.Copy(&buf, file)
	directory := configuration.DirectoryForUploadedDocs + header.Filename
	var osFile, osErr = os.Create(directory)
	defer osFile.Close()
	if osErr != nil {
		fmt.Printf("There was a problem writing the file to " + directory + "\n")
		panic(err)
		sendBoolResponse(rw,err)
		return
	}
	osFile.Write(buf.Bytes())
	buf.Reset()

	// TODO: fill document model
	document.Url = name[0]
	// TODO: store document as a record in database
	// data.SaveDocument(&document)

	sendBoolResponse(rw,err)
}

// form expected from frontend for document share
type DocSharePayload struct {
	Email 		string    `json:"email"`
	Mesage  	string    `json:"message"`
	Documents   []int  `json:"documents"`
}

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
		// TODO: log real error
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
		fmt.Printf("%v", err)
		sendBoolResponse(rw, err)
		return
	}
	// Create a buffer to write our archive to.
	buf := new(bytes.Buffer)
	// Create a new zip archive.
	w := zip.NewWriter(buf)
	defer w.Close()
	createZip(w, urls)
	//files := []zip.File{}

	rw.Header().Set("Content-Type", "application/zip")
	rw.Header().Set("Content-Disposition", "attachment; filename='file.html.zip'")
	http.ServeFile(rw, req, configuration.DirectoryForUploadedDocs)

}

func createZip(zip *zip.Writer, urls []string) {

	for _, url := range urls {
		file, err := os.Open(url)
		scanner := bufio.NewScanner(file)
		_, fileName := filepath.Split(url)
		zipFileWriter, err :=zip.Create(fileName)
		if err != nil {
			log.Fatal(err)
		}
		_, err = zipFileWriter.Write(scanner.Bytes())
		if err != nil {
			log.Fatal(err)
		}
	}
}


type Session struct{ //temperary session wrapper to store user id. Needs to be deleted later once sessions are implemented
	patient_id string
}

func createFileDestination(fileName string) (destination string) { //we need to finalize file structure
	session := &Session{patient_id: "patientId"}
	return session.patient_id + "/" + fileName
}
