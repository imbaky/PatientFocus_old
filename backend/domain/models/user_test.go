package models

import (
	"testing"
	"time"
)

func TestPFUser_TableName(t *testing.T) {
	type fields struct {
		Uid          int
		Email        string
		FirstName    string
		LastName     string
		Password     string
		Role         string
		Patient      *Patient
		Doctor       *Doctor
		DateCreated  time.Time
		DateModified time.Time
	}
	tests := []struct {
		name   string
		fields fields
		want   string
	}{
		{"basic", fields{1, "doc@gmail.com", "John", "Doe", "password", "patient", nil, nil, time.Now(), time.Now()}, "pfuser"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			u := &PFUser{
				Uid:          tt.fields.Uid,
				Email:        tt.fields.Email,
				FirstName:    tt.fields.FirstName,
				LastName:     tt.fields.LastName,
				Password:     tt.fields.Password,
				Role:         tt.fields.Role,
				Patient:      tt.fields.Patient,
				Doctor:       tt.fields.Doctor,
				DateCreated:  tt.fields.DateCreated,
				DateModified: tt.fields.DateModified,
			}
			if got := u.TableName(); got != tt.want {
				t.Errorf("PFUser.TableName() = %v, want %v", got, tt.want)
			}
		})
	}
}
