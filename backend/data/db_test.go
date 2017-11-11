package data

import (
	"testing"

	_ "github.com/lib/pq"
)

func TestInit(t *testing.T) {
	tests := []struct {
		name string
	}{
		{"pass"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			Init()
		})
	}
}

// func TestConnectToDb(t *testing.T) {
// 	tests := []struct {
// 		name string
// 	}{
// 		{"pass"},
// 	}
// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			ConnectToDb()
// 		})
// 	}
// }
