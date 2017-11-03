package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
)

func Authenticate(c *gin.Context) {
	tkn := strings.Replace(c.GetHeader("Authorization"), "Bearer ", "", -1)
	uid, err := data.GetIdFromSession(tkn)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			gin.H{"status": 440, "error": "Could not read request"})
		return
	}
	c.Set("uid", uid)
	c.Next()
}
