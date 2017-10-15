package handlers

import (
	"net/http"
	"fmt"
	"log"
	"bytes"
	"strings"
	"io"
	"os"
	"github.com/imbaky/PatientFocus/core/domain/model"
	"github.com/imbaky/PatientFocus/core/configuration"
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

type Session struct{ //temperary session wrapper to store user id. Needs to be deleted later once sessions are implemented
	patient_id string

}

func createFileDestination(fileName string) (destination string) { //we need to finalize file structure
	session := &Session{patient_id: "patientId"}
	return session.patient_id + "/" + fileName
}



