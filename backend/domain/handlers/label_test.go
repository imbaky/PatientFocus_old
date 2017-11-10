package handlers_test

import (
	"testing"
	"net/http"
	"net/http/httptest"
	"github.com/stretchr/testify/assert"
	"bytes"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/domain/handlers"
	
)

// func init() {
// 	data.ConnectToDb()
// 	// TODO: prepopulate database
// }

func TestCreateLabel(t *testing.T) {
	
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.Use(testMiddleware)

    router.POST("/label", handlers.CreateLabel)
	var jsonStr = []byte(`{"name":"black","color":"white"}`)
    req, err := http.NewRequest("POST", "/label", bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")
	// do not need token for some reason while testing
	//req.Header.Set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTAyMDMwNDYsImlkIjoiMSJ9.LRnPkoCPuLQ0BzWo2mwJNw9T2qLX5xeS_ww_9DHZ48k")
    if err != nil {
        fmt.Println(err)
    }
    resp := httptest.NewRecorder()
    router.ServeHTTP(resp, req)
    fmt.Println(resp)
    assert.Equal(t, resp.Code, 200)
}

func TestGetLabels(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.Use(testMiddleware)

    router.GET("/label", handlers.GetLabels)
	
    req, err := http.NewRequest("GET", "/label", nil)
	req.Header.Set("Content-Type", "application/json")
	
    if err != nil {
        fmt.Println(err)
    }
    resp := httptest.NewRecorder()
    router.ServeHTTP(resp, req)
	fmt.Println(resp)
    assert.Equal(t, resp.Code, 200)
}