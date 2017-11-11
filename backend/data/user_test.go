package data

import (
	"reflect"
	"testing"
	"time"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func TestCreateUser(t *testing.T) {
	type args struct {
		user *models.PFUser
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.PFUser{1, "john@gmail.com", "john", "doe", "pass", "patient", nil, nil, time.Now(), time.Now()}}, false},
		{"fail", args{&models.PFUser{1, "john@gmail.com", "john", "doe", "pass", "patient", nil, nil, time.Now(), time.Now()}}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CreateUser(tt.args.user); (err != nil) != tt.wantErr {
				t.Errorf("CreateUser() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestAssociateDoctor(t *testing.T) {
	type args struct {
		user *models.PFUser
	}
	doc := &models.Doctor{Did: 1}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.PFUser{Uid: 1, Doctor: doc}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := AssociateDoctor(tt.args.user); (err != nil) != tt.wantErr {
				t.Errorf("AssociateDoctor() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestAssociatePatient(t *testing.T) {
	type args struct {
		user *models.PFUser
	}
	pat := &models.Patient{Ptid: 3}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.PFUser{Uid: 1, Patient: pat}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := AssociatePatient(tt.args.user); (err != nil) != tt.wantErr {
				t.Errorf("AssociatePatient() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestReadUser(t *testing.T) {
	type args struct {
		user *models.PFUser
	}
	pat := &models.Patient{Ptid: 3}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{&models.PFUser{1, "john@gmail.com", "john", "doe", "pass", "patient", nil, nil, time.Now(), time.Now()}}, false},
		{"pass", args{&models.PFUser{Uid: 1}}, false},
		{"pass", args{&models.PFUser{Uid: 1, Patient: pat}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := ReadUser(tt.args.user); (err != nil) != tt.wantErr {
				t.Errorf("ReadUser() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
func TestGetSharedDocuments(t *testing.T) {
	type args struct {
		doctor  *models.PFUser
		patient *models.Patient
	}
	doctor := &models.Doctor{Did: 1}
	doc := &models.PFUser{Doctor: doctor}
	pat := &models.Patient{Ptid: 3}
	tests := []struct {
		name    string
		args    args
		want    []*models.Document
		wantErr bool
	}{
		{"pass", args{doc, pat}, []*models.Document{}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetSharedDocuments(tt.args.doctor, tt.args.patient)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetSharedDocuments() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetSharedDocuments() = %v, want %v", got, tt.want)
			}
		})
	}
}
