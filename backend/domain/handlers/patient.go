package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func CreatePatient(c *gin.Context) {
	var patient models.Patient
	user := models.PFUser{Uid: c.GetInt("uid")}
	err := c.BindJSON(&patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not read request"})
		return
	}
	err = data.CreatePatient(&patient)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"status": http.StatusInternalServerError, "error": "Failed to create the patient"})
	}
	err = data.AssociatePatient(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"status": http.StatusInternalServerError, "error": "Failed to associate the patient witht the user"})
	}
	c.JSON(http.StatusOK, gin.H{
		"status":        http.StatusOK,
		"id":            user.Patient.Pid,
		"race":          user.Patient.Race,
		"gender":        user.Patient.Gender,
		"language":      user.Patient.Language,
		"date_of_birth": user.Patient.DateOfBirth})
}
