/*
	Package handlers holds all the handlers that are used by the main router
*/

package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// CreateUser registers a user, adds him to the database and returns his information
func CreateUser(c *gin.Context) {
	var newUser models.PFUser

	err := c.BindJSON(&newUser)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not read request"})
		return
	}

	err = data.CreateUser(&newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to create the user"})
		return
	}

	tkn, err := data.GetSession(&newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Could not create session token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"token": &tkn,
	})
}

// GetUser returns the users details and information
func GetUser(c *gin.Context) {
	var user models.PFUser
	user.Uid, _ = strconv.Atoi(c.Param("uid"))

	err := data.ReadUser(&user)
	if err != nil {
		c.JSON(http.StatusNotFound,
			gin.H{"error": "Failed to find user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": &user})
}

//Login endpoint authenticates and returns a token
func Login(c *gin.Context) {
	var user models.PFUser

	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"error": "Could not read request"})
		return
	}

	err = data.ReadUser(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Bad username or password "})
		return
	}

	tkn, err := data.GetSession(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Could not create session token"})
		return
	}

	c.JSON(200, gin.H{"token": tkn})
}
