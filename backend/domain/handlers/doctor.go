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
	err = data.ReadUser(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to find user"})
		return
	}
	err = data.CreateDoctor(&doctor)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to create the doctor"})
		return
	}
	user.Doctor = &doctor
	err = data.AssociateDoctor(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to associate the patient with the user"})
		return
	}
	tkn, err := data.GetSession(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Could not create session token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"token": tkn})
}

// Get all patients that have added the doctor
func GetDoctorPatients(c *gin.Context) {
	var patients []models.Patient
	err := data.GetPatients(&patients)
	if err != nil {
		c.JSON(http.StatusNotFound,
			gin.H{"error": "No patients found "})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "patients": &patients})

}