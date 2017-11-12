package handlers

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/configuration"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// DocSharePayload is the expected struct when
//requesting to share documents with a doctor
type DocSharePayload struct {
	Email     string `json:"email"`
	Mesage    string `json:"message"`
	Documents []int  `json:"documents"`
}

// JsonUrls is the struct of urls that are to returned to the client
type JsonUrls struct {
	Urls []string `json:"urls"`
}

func GetDocument(c *gin.Context) {
	var patient models.Patient
	pid, _ := strconv.Atoi(c.Param("id"))
	patient.Ptid = pid

	err := data.ReadPatientDocuments(&patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not read patient"})
		return
	}

	c.JSON(http.StatusOK,
		gin.H{
			"documents": &patient.Documents,
		})

}

// UploadDocument saves the document in the configuration.DirectoryForUploadDocs
//directory and associates it to the patient
func UploadDocument(c *gin.Context) {
	var document models.Document
	var patient models.Patient

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not get file"})
		return
	}

	pid := c.Param("number")
	intPid, _ := strconv.Atoi(pid)
	patient.Ptid = intPid
	document.Url = configuration.DirectoryForUploadedDocs + file.Filename
	document.Patient = &patient
	err = c.SaveUploadedFile(file, document.Url)

	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not save the file"})
		return
	}

	role, _ := c.Get("role")
	if role == "doctor" {
		doctor := models.Doctor{Did: c.GetInt("role_id")}
		document.Doctors = []*models.Doctor{&doctor}
	}

	err = data.CreateDocument(&document)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not save document in db"})
		return
	}

	c.JSON(http.StatusOK,
		gin.H{
			"document": &document,
		})
}

// ShareDocument is used to connect the document to the
//doctor that must already be connected to the patient
func ShareDocument(c *gin.Context) {
	var docSharePayload DocSharePayload
	var patient models.PFUser
	var doctor models.PFUser
	err := c.BindJSON(&docSharePayload)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not bind json"})
		return
	}
	documents := make([]models.Document, len(docSharePayload.Documents))

	role, _ := c.Get("role")
	if role == "patient" {
		patient.Uid = c.GetInt("user_id")
		doctor.Email = docSharePayload.Email
	} else if role == "doctor" {
		doctor.Uid = c.GetInt("user_id")
		patient.Email = docSharePayload.Email
	}

	err = data.ReadUser(&doctor)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not get doctor by email"})
		return
	}

	err = data.ReadUser(&patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not get user by email"})
		return
	}

	err = data.LinkPatientDoctor(&doctor, &patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Cannot connect doctor and patient"})
		return
	}
	err = data.PatientDoctorLinked(&doctor, &patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Doctor and patient are not connected"})
		return
	}

	for i, did := range docSharePayload.Documents {
		documents[i] = models.Document{Did: did}
	}

	err = data.LinkDoctorDocument(&doctor, documents)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not give doctor access to document"})
		return
	}
	c.JSON(http.StatusOK, gin.H{})
}

// GetSharedDocuments returns the documents that have
//been shared between the patient and the doctor
func GetSharedDocuments(c *gin.Context) {
	var patient models.Patient
	var doctor models.PFUser
	doctor.Uid = c.GetInt("user_id")

	err := c.BindJSON(&patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not bind json "})
		return
	}

	err = data.ReadUser(&doctor)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not find doctor "})
		return
	}

	err = data.ReadPatient(&patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not find patient "})
		return
	}

	documents, err := data.GetSharedDocuments(&doctor, &patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not find shared documents "})
		return
	}

	urls := JsonUrls{Urls: make([]string, len(documents))}
	for i, url := range documents {
		urls.Urls[i] = url.Url
	}
	c.JSON(http.StatusOK,
		gin.H{
			"documents": urls,
		},
	)
}

type DocumentLabelPayload struct {
	Document int `json:"documentid"`
	Labels []int `json:"labels"`
}

func LinkDocumentLabels(c *gin.Context) {
	var payload DocumentLabelPayload
	var document models.Document

	err := c.BindJSON(&payload)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not bind json "})
		return
	}
	document.Did = payload.Document
	labels := make([]*models.Label,len(payload.Labels))
	
	for k,v := range payload.Labels {
		labels[k]= &models.Label{Lid:v}
	}
	err = data.LinkDocumentLabels(&document, labels)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Could not link the labels "})
		return
	}
	c.JSON(http.StatusOK, gin.H{})

}
