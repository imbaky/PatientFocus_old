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

	"github.com/gin-gonic/gin/json"
	"bytes"
)

var router *gin.Engine
var newUser models.PFUser

func init() {
    data.ConnectToDb()
	gin.SetMode(gin.TestMode)
	router = gin.Default()

	// pre-populate database
    ormObject := data.GetOrmObject()
	newUser = models.PFUser{
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
    c.Set("uid", 1)
}

func TestGetUser(t *testing.T) {

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

func TestValidLogin(t *testing.T) {
	data, err := json.Marshal(newUser)
	if (err != nil) {
		fmt.Println(err)
	}
	router.POST("/auth/login", handlers.Login)
	url := fmt.Sprintf("/auth/login")
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	if err != nil {
		fmt.Println(err)
	}
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)
	fmt.Println(resp)
	assert.Equal(t, resp.Code, 200)
}

