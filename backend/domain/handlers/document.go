package handlers

import (
	"net/http"

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

// UploadDocument saves the document in the configuration.DirectoryForUploadDocs
//directory and associates it to the patient
func UploadDocument(c *gin.Context) {
	var document models.Document
	var user models.PFUser
	err := c.BindJSON(&document)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not bind json"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not get file"})
		return
	}

	document.Url = configuration.DirectoryForUploadedDocs + file.Filename
	err = c.SaveUploadedFile(file, document.Url)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not save the file"})
		return
	}

	err = data.CreateDocument(&document)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not save document in db"})
		return
	}
	user.Uid = c.GetInt("uid")
	err = data.ReadUser(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not save document in db"})
		return
	}

	err = data.LinkDocumentPatient(&document, &user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not save document in db"})
		return
	}

	c.JSON(http.StatusOK,
		gin.H{
			"id":            document.Did,
			"url":           document.Url,
			"desc":          document.Description,
			"date_created":  document.DateCreated,
			"date_modified": document.DateModified,
		})
}

// ShareDocument is used to connect the document to the
//doctor that must already be connected to the patient
func ShareDocument(c *gin.Context) {
	var docSharePayload DocSharePayload
	var user models.PFUser
	var doctor models.PFUser
	documents := make([]models.Document, len(docSharePayload.Documents))
	user.Uid = c.GetInt("uid")

	err := c.BindJSON(&docSharePayload)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not bind json"})
		return
	}

	doctor.Email = docSharePayload.Email
	err = data.ReadUser(&doctor)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not get doctor by email"})
		return
	}

	err = data.ReadUser(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not get user by email"})
		return
	}

	err = data.PatientDoctorLinked(&doctor, &user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Doctor and patient are not connected"})
		return
	}

	for i, did := range docSharePayload.Documents {
		documents[i].Did = did
	}

	err = data.LinkDoctorDocument(&doctor, documents)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not give doctor access to document"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK})
}

// GetSharedDocuments returns the documents that have
//been shared between the patient and the doctor
func GetSharedDocuments(c *gin.Context) {
	var patient models.PFUser
	var doctor models.PFUser
	doctor.Uid = c.GetInt("uid")

	err := data.ReadUser(&doctor)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not find doctor "})
		return
	}

	err = data.ReadUser(&patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not find patient "})
		return
	}

	documents, err := data.GetSharedDocuments(&doctor, &patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not find shared documents "})
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
