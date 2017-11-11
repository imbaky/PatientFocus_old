package data

import (
	"testing"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func TestCreateDocument(t *testing.T) {
	type args struct {
		document *models.Document
	}
	docu := &models.Document{Did: 1}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{docu}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CreateDocument(tt.args.document); (err != nil) != tt.wantErr {
				t.Errorf("CreateDocument() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
