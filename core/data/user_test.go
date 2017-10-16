package data

import (
	"reflect"
	"testing"

	"github.com/imbaky/PatientFocus/core/domain/model"
)

func TestGetUser(t *testing.T) {
	type args struct {
		userid string
	}
	patient := &model.Patient{}
	tests := []struct {
		name     string
		args     args
		wantUser model.User
		wantErr  bool
	}{
		{"getUser1", args{"111"}, model.User{-1, "test@gmail.com", "tester", "testerson", "patient", "password", patient}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if gotUser := GetUser(tt.args.userid); !tt.wantErr && !reflect.DeepEqual(gotUser, tt.wantUser) {
				t.Errorf("GetUser() = %v, want %v", gotUser, tt.wantUser)
			}
		})
	}
}

func TestSaveUser(t *testing.T) {
	type args struct {
		user *model.User
	}
	patient := &model.Patient{}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"saveUser1", args{&model.User{-1, "test@gmail.com", "tester", "testerson", "patient", "password", patient}}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := SaveUser(tt.args.user); (err != nil) != tt.wantErr {
				t.Errorf("SaveUser() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestCreatePatient(t *testing.T) {
	type args struct {
		patient *model.Patient
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
	// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CreatePatient(tt.args.patient); (err != nil) != tt.wantErr {
				t.Errorf("CreatePatient() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
