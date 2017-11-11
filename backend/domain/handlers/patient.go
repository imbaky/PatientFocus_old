package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/models"
	"strconv"
)

// CreatePatient registers a patient and returns his information
func CreatePatient(c *gin.Context) {
	var patient models.Patient
	user := models.PFUser{Uid: c.GetInt("user_id")}

	err := c.BindJSON(&patient)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not read request"})
		return
	}
	err = data.CreatePatient(&patient)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to create the patient"})
		return
	}
	user.Patient = &patient
	err = data.AssociatePatient(&user)
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

func GetPatient (c *gin.Context){
	var patient models.Patient

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not read request"})
		return
	}
	patient.Ptid = id
	err = data.ReadPatient(&patient)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"status": http.StatusBadRequest, "error": "Could not read request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"patient":&patient,
		})
}
