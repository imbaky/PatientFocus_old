package data

import (
	"testing"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

const permaToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDYyODEzMTksInJvbGUiOiJwYXRpZW50Iiwicm9sZV9pZCI6IjEiLCJ1c2VyX2lkIjoiMSJ9.pHtBigwqNT9IZlbp45zneDIb1ZVrja8VAs_j1YHw2E8"

func TestGetSession(t *testing.T) {
	type args struct {
		user *models.PFUser
	}
	tests := []struct {
		name    string
		args    args
		notWant string
		wantErr bool
	}{
		{"pass", args{&models.PFUser{Uid: 123}}, "", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetSession(tt.args.user)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetSession() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got == tt.notWant {
				t.Errorf("GetSession() = %v, want %v", got, tt.notWant)
			}
		})
	}
}

func TestCheckSession(t *testing.T) {
	type args struct {
		tokenString string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{"pass", args{permaToken}, false},
		{"fail", args{"blahblah"}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CheckSession(tt.args.tokenString); (err != nil) != tt.wantErr {
				t.Errorf("CheckSession() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestGetIdFromSession(t *testing.T) {
	type args struct {
		tokenString string
	}
	tests := []struct {
		name    string
		args    args
		want    int
		want1   string
		want2   int
		wantErr bool
	}{
		{"pass", args{permaToken}, 1, "patient", 1, false},
		{"fail", args{"blahblah"}, 0, "", -1, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1, got2, err := GetIdFromSession(tt.args.tokenString)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetIdFromSession() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("GetIdFromSession() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("GetIdFromSession() got1 = %v, want %v", got1, tt.want1)
			}
			if got2 != tt.want2 {
				t.Errorf("GetIdFromSession() got2 = %v, want %v", got2, tt.want2)
			}
		})
	}
}
