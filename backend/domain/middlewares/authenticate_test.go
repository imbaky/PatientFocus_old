package middlewares

import (
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

const permaToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDYyODEzMTksInJvbGUiOiJwYXRpZW50Iiwicm9sZV9pZCI6IjEiLCJ1c2VyX2lkIjoiMSJ9.pHtBigwqNT9IZlbp45zneDIb1ZVrja8VAs_j1YHw2E8"

func TestAuthenticate(t *testing.T) {
	type args struct {
		c *gin.Context
	}
	gin.SetMode(gin.TestMode)

	recorderPass := httptest.NewRecorder()
	contextPass, _ := gin.CreateTestContext(recorderPass)
	recorderFail := httptest.NewRecorder()
	contextFail, _ := gin.CreateTestContext(recorderFail)
	reqPass := httptest.NewRequest("GET", "/patient", nil)
	reqPass.Header.Set("Authorization", "Bearer "+permaToken)
	contextPass.Request = reqPass
	reqFail := httptest.NewRequest("GET", "/patient", nil)
	reqFail.Header.Set("Authorization", "Bearer ")
	contextFail.Request = reqFail

	tests := []struct {
		name string
		args args
	}{
		{"Pass", args{contextPass}},
		{"Fail", args{contextFail}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			Authenticate(tt.args.c)
		})
	}
}
