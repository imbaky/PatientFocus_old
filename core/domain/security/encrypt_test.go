package security

import (
	"testing"

	"github.com/imbaky/PatientFocus/core/domain/model"
)

func TestEncryptPassword(t *testing.T) {
	type args struct {
		user *model.User
	}
	tests := []struct {
		name string
		args args
	}{
	// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			EncryptPassword(tt.args.user)
		})
	}
}
