package handlers_test
  
import (
    "fmt"
    "net/http"
    "net/http/httptest"
    "github.com/stretchr/testify/assert"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/imbaky/PatientFocus/backend/domain/handlers"
    "github.com/imbaky/PatientFocus/backend/data"

)

func init() {
    data.ConnectToDb()
}

func TestGetUser(t *testing.T) {
    gin.SetMode(gin.TestMode)
    // this is what I expect
    /*handler := func(c *gin.Context) {
        c.String(http.StatusOk, "bar")
    }*/
    router := gin.Default()
    router.GET("/user/:uid", handlers.GetUser)
    url := fmt.Sprintf("/user/%d", 1)
    req, err := http.NewRequest("GET", url, nil)
    req.Header.Set("Content-Type", "application/json")
    if err != nil {
        fmt.Println(err)
    }
    resp := httptest.NewRecorder()
    router.ServeHTTP(resp, req)
    fmt.Println(resp)
    assert.Equal(t, resp.Code, 200)
}
