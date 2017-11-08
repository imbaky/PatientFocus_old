package data

import "github.com/imbaky/PatientFocus/backend/domain/models"

// CreateLabel creates a record in the datbase
func CreateLabel(label *models.Label) (err error) {
	_, err = ormObject.Insert(label)
	return
}

// Retrieve label from the database
func GetLabel(label *models.Label) error {
	return ormObject.Read(label)
}