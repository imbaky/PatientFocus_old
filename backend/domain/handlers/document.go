package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/configuration"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

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
	dest := configuration.DirectoryForUploadedDocs + file.Filename
	err = c.SaveUploadedFile(file, dest)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not save the file"})
		return
	}
	document.Url = dest
	// err = data.CreateDocument(&document)
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

	// err = data.AssociateDocumentToPatient(&document, &user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not save document in db"})
		return
	}

	c.JSON(http.StatusOK,
		gin.H{
			"id":            document.Did,
			"url":           document.Url,
			"desc":          document.Desc,
			"date_created":  document.DateCreated,
			"date_modified": document.DateModified,
		})
}

// form expected from frontend for document share
type DocSharePayload struct {
	Email     string `json:"email"`
	Mesage    string `json:"message"`
	Documents []int  `json:"documents"`
}

func ShareDocument(c *gin.Context) {
	var docSharePayload DocSharePayload
	var user models.PFUser

	err := c.BindJSON(&docSharePayload)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not bind json"})
		return
	}
	user.Email = docSharePayload.Email
	err = data.ReadUser(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not get user by email"})
		return
	}

}
