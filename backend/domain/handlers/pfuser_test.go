package handlers_test
  
import (
    "fmt"
    "net/http"
    "net/http/httptest"
    "github.com/stretchr/testify/assert"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/imbaky/PatientFocus/backend/domain/handlers"
    "github.com/imbaky/PatientFocus/backend/domain/models"
    "github.com/imbaky/PatientFocus/backend/data"

)

func init() {
    data.ConnectToDb()
    // pre-populate database
    ormObject := data.GetOrmObject()
    var newUser = models.PFUser{
        Email: "test@me.com",
        FirstName: "Test",
        LastName: "User",
        Password: "foobar",
    }
    ormObject.Insert(&newUser)
    
    // TODO: do a tear down?
    // In travis it is automatically done
}

func testMiddleware(c *gin.Context) {
    // set default user to 1
    c.Set("user_id", 1)
}

func TestGetUser(t *testing.T) {
    gin.SetMode(gin.TestMode)

    router := gin.Default()
    router.Use(testMiddleware)
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
