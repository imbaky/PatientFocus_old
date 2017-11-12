package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// CreatePatient registers a patient and returns his information
func CreateDoctor(c *gin.Context) {
	var doctor models.Doctor
	user := models.PFUser{Uid: c.GetInt("user_id")}
	err := c.BindJSON(&doctor)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not read request"})
		return
	}
	err = data.CreateDoctor(&doctor)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to create the patient"})
		return
	}
	user.Doctor = &doctor
	err = data.AssociateDoctor(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to associate the patient with the user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"doctor": user.Doctor})
}
