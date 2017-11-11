/*
	Package handlers holds all the handlers that are used by the main router
*/

package handlers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func TestCreateUser(t *testing.T) {
	gin.SetMode(gin.TestMode)
	user := models.PFUser{10, "tame@gmail.com", "tame", "tom", "pass", "patient", nil, nil, time.Now(), time.Now()}
	recorderPass := httptest.NewRecorder()
	recorderFail := httptest.NewRecorder()
	contextPass, _ := gin.CreateTestContext(recorderPass)
	contextFail, _ := gin.CreateTestContext(recorderFail)
	body, _ := json.Marshal(user)
	reqPass := httptest.NewRequest("POST", "/user", bytes.NewReader(body))
	reqFail := httptest.NewRequest("POST", "/user", nil)
	contextPass.Request = reqPass
	contextFail.Request = reqFail
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		args args
	}{
		{"pass", args{contextPass}},
		{"fail", args{contextPass}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			CreateUser(tt.args.c)
		})
	}
}

func TestGetUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	user := models.PFUser{10, "tame@gmail.com", "tame", "tom", "pass", "patient", nil, nil, time.Now(), time.Now()}
	recorderPass := httptest.NewRecorder()
	recorderFail := httptest.NewRecorder()
	contextPass, _ := gin.CreateTestContext(recorderPass)
	contextFail, _ := gin.CreateTestContext(recorderFail)
	body, _ := json.Marshal(user)
	reqPass := httptest.NewRequest("POST", "/user", bytes.NewReader(body))
	reqFail := httptest.NewRequest("POST", "/user", nil)
	contextPass.Request = reqPass
	contextFail.Request = reqFail

	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		args args
	}{
		{"pass", args{contextPass}},
		{"fail", args{contextPass}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			GetUser(tt.args.c)
		})
	}
}

func TestLogin(t *testing.T) {
	gin.SetMode(gin.TestMode)

	user := models.PFUser{10, "tame@gmail.com", "tame", "tom", "pass", "patient", nil, nil, time.Now(), time.Now()}
	bad := models.PFUser{Uid: 11}
	recorderPass := httptest.NewRecorder()
	recorderFail := httptest.NewRecorder()
	recorderBad := httptest.NewRecorder()
	contextPass, _ := gin.CreateTestContext(recorderPass)
	contextFail, _ := gin.CreateTestContext(recorderFail)
	contextBad, _ := gin.CreateTestContext(recorderBad)
	body, _ := json.Marshal(user)
	bodyBad, _ := json.Marshal(bad)
	reqPass := httptest.NewRequest("POST", "/user", bytes.NewReader(body))
	reqFail := httptest.NewRequest("POST", "/user", nil)
	reqBad := httptest.NewRequest("POST", "/user", bytes.NewReader(bodyBad))
	contextPass.Request = reqPass
	contextFail.Request = reqFail
	contextBad.Request = reqBad

	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		args args
	}{
		{"pass", args{contextPass}},
		{"bad", args{contextBad}},
		{"fail", args{contextPass}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			Login(tt.args.c)
		})
	}
}
