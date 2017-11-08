package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
)

// Authenticate checks the Authorization header "Bearer" for the session token and
// extract the uid from it and adds it to the context for later use in the application.
func Authenticate(c *gin.Context) {
	tkn := strings.Replace(c.GetHeader("Authorization"), "Bearer ", "", -1)
	uid, role, rid, err := data.GetIdFromSession(tkn)
	if err != nil {
		fmt.Println("there was an error with authenticate")
		c.JSON(http.StatusBadRequest,
			gin.H{"status": 440, "error": "Could not read request"})
		return
	}

	c.Set("user_id", uid)
	c.Set("role", role)
	c.Set("role_id", rid)
	c.Next()
}
