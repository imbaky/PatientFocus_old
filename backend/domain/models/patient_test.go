package models

import (
	"testing"
	"time"
)

func TestPatient_TableName(t *testing.T) {
	type fields struct {
		Ptid         int
		Race         string
		Gender       Gender
		Language     Language
		DateOfBirth  time.Time
		Smoke        bool
		Documents    []*Document
		Doctors      []*Doctor
		DateCreated  time.Time
		DateModified time.Time
	}
	tests := []struct {
		name   string
		fields fields
		want   string
	}{
		{"basic", fields{1, "Caucasian", "male", "french", time.Now(), false, nil, nil, time.Now(), time.Now()}, "patient"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			u := &Patient{
				Ptid:         tt.fields.Ptid,
				Race:         tt.fields.Race,
				Gender:       tt.fields.Gender,
				Language:     tt.fields.Language,
				DateOfBirth:  tt.fields.DateOfBirth,
				Smoke:        tt.fields.Smoke,
				Documents:    tt.fields.Documents,
				Doctors:      tt.fields.Doctors,
				DateCreated:  tt.fields.DateCreated,
				DateModified: tt.fields.DateModified,
			}
			if got := u.TableName(); got != tt.want {
				t.Errorf("Patient.TableName() = %v, want %v", got, tt.want)
			}
		})
	}
}
