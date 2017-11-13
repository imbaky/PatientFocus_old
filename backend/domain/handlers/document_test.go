package handlers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestGetDocument(t *testing.T) {
	gin.SetMode(gin.TestMode)

	recorderPass := httptest.NewRecorder()
	contextPass, _ := gin.CreateTestContext(recorderPass)
	reqPass := httptest.NewRequest("GET", "/document/1", nil)
	reqPass.Header.Set("Authorization", "Bearer "+permaToken)
	contextPass.Request = reqPass
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		args args
	}{
		{"pass", args{contextPass}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			GetDocument(tt.args.c)
		})
	}
}

func TestUploadDocument(t *testing.T) {
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		args args
	}{
	// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			UploadDocument(tt.args.c)
		})
	}
}

func TestShareDocument(t *testing.T) {
	gin.SetMode(gin.TestMode)

	payload := DocSharePayload{"john@gmail.com", "who cares", []int{1}}
	body, _ := json.Marshal(payload)
	recorderPass := httptest.NewRecorder()
	contextPass, _ := gin.CreateTestContext(recorderPass)
	reqPass := httptest.NewRequest("POST", "/document/share", bytes.NewReader(body))
	reqPass.Header.Set("Authorization", "Bearer "+permaToken)
	contextPass.Request = reqPass
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		args args
	}{
		{"pass", args{contextPass}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ShareDocument(tt.args.c)
		})
	}
}

func TestGetSharedDocuments(t *testing.T) {
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		args args
	}{
	// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			GetSharedDocuments(tt.args.c)
		})
	}
}
