package handlers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/imbaky/PatientFocus/backend/domain/models"

	"github.com/gin-gonic/gin"
)

func TestCreateDoctor(t *testing.T) {
	gin.SetMode(gin.TestMode)

	doctor := models.Doctor{77, nil, "brain", "234", nil, time.Now(), time.Now()}
	recorderPass := httptest.NewRecorder()
	recorderFail := httptest.NewRecorder()
	recorderBad := httptest.NewRecorder()
	contextPass, _ := gin.CreateTestContext(recorderPass)
	contextFail, _ := gin.CreateTestContext(recorderFail)
	contextBad, _ := gin.CreateTestContext(recorderBad)
	body, _ := json.Marshal(doctor)
	reqPass := httptest.NewRequest("POST", "/patient", bytes.NewReader(body))
	reqPass.Header.Set("Authorization", "Bearer "+permaToken)
	reqFail := httptest.NewRequest("POST", "/patient", nil)
	reqFail.Header.Set("Authorization", "Bearer "+permaToken)
	reqBad := httptest.NewRequest("POST", "/user", bytes.NewReader(body))
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
		{"fail", args{contextFail}},
		{"fail", args{contextBad}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			CreateDoctor(tt.args.c)
		})
	}
}
