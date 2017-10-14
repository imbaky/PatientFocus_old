package data

import (
	"testing"

	"github.com/imbaky/PatientFocus/core/domain/model"
)

func TestGetSession(t *testing.T) {
	type user struct {
		user *model.User
	}
	checks := []struct {
		name    string
		token   string
		wantErr bool
	}{
		{"checkTest1", "", false},
		{"checkTest2", "", false},
		{"checkTest3", "", false},
		{"checkTest4", "", false},
	}
	gets := []struct {
		name    string
		users   user
		wantErr bool
	}{
		{"getTest1", user{&model.User{-1, "test@gmail.com", "tester", "testerson", "patient", "password"}}, false},
		{"getTest2", user{&model.User{666, "test@gmail.com", "tester", "testerson", "patient", "1234ERTG$#%k"}}, false},
		{"getTest3", user{&model.User{444, "test@gmail.com", "tester", "testerson", "doctor", ""}}, false},
		{"getTest4", user{&model.User{333, "test@gmail.com", "tester", "testerson", "patient", "password"}}, false},
	}
	i := 0
	for _, tt := range gets {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetSession(tt.users.user)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetSession() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			checks[i].token = got
			i++
		})
	}
	for _, tt := range checks {
		t.Run(tt.name, func(t *testing.T) {
			if err := CheckSession(tt.token); (err != nil) != tt.wantErr {
				t.Errorf("CheckSession() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
