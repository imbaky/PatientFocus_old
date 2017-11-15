package data

import (
	"testing"
	"time"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func TestCreatePatient(t *testing.T) {
	type args struct {
		patient *models.Patient
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.Patient{3, "Caucasian", "male", "french", time.Now(), false, nil, nil, time.Now(), time.Now()}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CreatePatient(tt.args.patient); (err != nil) != tt.wantErr {
				t.Errorf("CreatePatient() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestReadPatient(t *testing.T) {
	type args struct {
		patient *models.Patient
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.Patient{3, "Caucasian", "male", "french", time.Now(), false, nil, nil, time.Now(), time.Now()}}, false},
		{"fail", args{&models.Patient{1, "Caucasian", "male", "french", time.Now(), false, nil, nil, time.Now(), time.Now()}}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := ReadPatient(tt.args.patient); (err != nil) != tt.wantErr {
				t.Errorf("ReadPatient() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestReadPatientDocuments(t *testing.T) {
	type args struct {
		patient *models.Patient
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.Patient{3, "Caucasian", "male", "french", time.Now(), false, nil, nil, time.Now(), time.Now()}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := ReadPatientDocuments(tt.args.patient); (err != nil) != tt.wantErr {
				t.Errorf("ReadPatientDocuments() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestLinkPatientDoctor(t *testing.T) {
	type args struct {
		doctor  *models.PFUser
		patient *models.PFUser
	}
	pat := &models.Patient{3, "Caucasian", "male", "french", time.Now(), false, nil, nil, time.Now(), time.Now()}
	upat := &models.PFUser{Patient: pat}
	doc := &models.Doctor{1, nil, "heart", "123", nil, time.Now(), time.Now()}
	udoc := &models.PFUser{Doctor: doc}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{udoc, upat}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := LinkPatientDoctor(tt.args.doctor, tt.args.patient); (err != nil) != tt.wantErr {
				t.Errorf("LinkPatientDoctor() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPatientDoctorLinked(t *testing.T) {
	type args struct {
		doctor  *models.PFUser
		patient *models.PFUser
	}
	pat := &models.Patient{3, "Caucasian", "male", "french", time.Now(), false, nil, nil, time.Now(), time.Now()}
	upat := &models.PFUser{Patient: pat}
	doc := &models.Doctor{1, nil, "heart", "123", nil, time.Now(), time.Now()}
	udoc := &models.PFUser{Doctor: doc}
	docF := &models.Doctor{10, nil, "heart", "123", nil, time.Now(), time.Now()}
	udocF := &models.PFUser{Doctor: docF}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{udoc, upat}, false},
		{"fail", args{udocF, upat}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := PatientDoctorLinked(tt.args.doctor, tt.args.patient); (err != nil) != tt.wantErr {
				t.Errorf("PatientDoctorLinked() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestLinkDoctorDocument(t *testing.T) {
	type args struct {
		doctor    *models.PFUser
		documents []models.Document
	}
	doc := &models.Doctor{1, nil, "heart", "123", nil, time.Now(), time.Now()}
	udoc := &models.PFUser{Doctor: doc}
	docu := []models.Document{models.Document{Did: 1}}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{udoc, docu}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := LinkDoctorDocument(tt.args.doctor, tt.args.documents); (err != nil) != tt.wantErr {
				t.Errorf("LinkDoctorDocument() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
