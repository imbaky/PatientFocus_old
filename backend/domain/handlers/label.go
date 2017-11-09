package handlers

import (
	"net/http"

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
	// attach user to this label
	newLabel.Uid = &models.PFUser{Uid:c.GetInt("uid")}
	err = data.ReadUser(newLabel.Uid)
	if err != nil {
		// should not happen but this means user not found
		c.JSON(http.StatusInternalServerError,
			gin.H{"status": http.StatusInternalServerError, "error": "Failed to find user"})
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
		"uid":		newLabel.Uid,
		"name":     newLabel.Name,
		"color": 	newLabel.Color})

}

// Retrieve label owned by this user
func GetLabels(c *gin.Context) {
	var labels []models.Label
	var uid = c.GetInt("uid")
	err := data.GetLabels(uid, &labels)
	if err != nil {
		c.JSON(http.StatusNotFound,
			gin.H{"status": http.StatusNotFound, "error": "Failed to find label"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "labels": &labels})

}