package data

import (
	"testing"
	"time"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func TestCreateDoctor(t *testing.T) {
	type args struct {
		doctor *models.Doctor
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.Doctor{1, nil, "heart", 1, nil, time.Now(), time.Now()}}, false},
		{"fail", args{&models.Doctor{1, nil, "heart", 1, nil, time.Now(), time.Now()}}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CreateDoctor(tt.args.doctor); (err != nil) != tt.wantErr {
				t.Errorf("CreateDoctor() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestReadDoctorDocuments(t *testing.T) {
	type args struct {
		doctor *models.Doctor
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.Doctor{1, nil, "heart", 1, nil, time.Now(), time.Now()}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := ReadDoctorDocuments(tt.args.doctor); (err != nil) != tt.wantErr {
				t.Errorf("ReadDoctorDocuments() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
