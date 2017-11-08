package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// CreateLabel registers a user, adds him to the database and returns his information
func CreateLabel(c *gin.Context) {
	var newLabel models.Label

	err := c.BindJSON(&newLabel)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not read request"})
		return
	}

	err = data.CreateLabel(&newLabel)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"status": http.StatusInternalServerError, "error": "Failed to create the label"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":	http.StatusOK,
		"id":       newLabel.Lid,
		"name":     newLabel.Name,
		"color": 	newLabel.Color})

}

// Retrieve label
func GetLabel(c *gin.Context) {
	var label models.Label
	label.Lid, _ = strconv.Atoi(c.Param("lid"))

	err := data.GetLabel(&label)
	if err != nil {
		c.JSON(http.StatusNotFound,
			gin.H{"status": http.StatusNotFound, "error": "Failed to find label"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "label": &label})

}