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
	err = data.CreateUser(&newUser)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{
			"status":     http.StatusOK,
			"id":         newUser.Uid,
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
	user.Uid, _ = strconv.Atoi(c.Param("uid"))
	qs := data.ReadUser(&user)
	if qs != nil {
		c.JSON(http.StatusNotFound,
			gin.H{"status": http.StatusNotFound, "error": "Failed to find user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "users": &user})

	return
}

//Login endpoint authenticates and returns a token
func Login(c *gin.Context) {
	var user models.PFUser
	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusBadRequest, "error": "Could not read request"})
		return
	}
	err = data.AuthenticateUser(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusInternalServerError, "error": "Bad username or password "})
		return
	}
	tkn, err := data.GetSession(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": http.StatusInternalServerError, "error": "Could not create session token"})
		return
	}
	c.JSON(200,
		gin.H{
			"token": tkn,
		})
}
