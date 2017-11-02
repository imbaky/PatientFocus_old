package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func CreateUser(c *gin.Context) {
	var newUser models.PFUser
	err := c.BindJSON(&newUser)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not read request"})
		return
	}
	_, err = data.CreateUser(&newUser)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{
			"status":     http.StatusOK,
			"id":         newUser.Id,
			"email":      newUser.Email,
			"first_name": newUser.FirstName,
			"last_name":  newUser.LastName})
	} else {
		c.JSON(http.StatusInternalServerError,
			gin.H{"status": http.StatusInternalServerError, "error": "Failed to create the user"})
	}
}

func GetUser(c *gin.Context) {
	var user models.PFUser
	user.Id, _ = strconv.Atoi(c.Param("uid"))
	qs := data.ReadUser(&user)
	if qs != nil {
		c.JSON(http.StatusNotFound,
			gin.H{"status": http.StatusNotFound, "error": "Failed to find user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "users": &user})

	return
}
