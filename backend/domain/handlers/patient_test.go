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

const permaToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDYyODEzMTksInJvbGUiOiJwYXRpZW50Iiwicm9sZV9pZCI6IjEiLCJ1c2VyX2lkIjoiMSJ9.pHtBigwqNT9IZlbp45zneDIb1ZVrja8VAs_j1YHw2E8"

func TestCreatePatient(t *testing.T) {
	gin.SetMode(gin.TestMode)

	patient := models.Patient{444, "Caucasian", "male", "french", time.Now(), true, nil, nil, time.Now(), time.Now()}
	recorderPass := httptest.NewRecorder()
	recorderFail := httptest.NewRecorder()
	recorderBad := httptest.NewRecorder()
	contextPass, _ := gin.CreateTestContext(recorderPass)
	contextFail, _ := gin.CreateTestContext(recorderFail)
	contextBad, _ := gin.CreateTestContext(recorderBad)
	body, _ := json.Marshal(patient)
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
			CreatePatient(tt.args.c)
		})
	}
}
