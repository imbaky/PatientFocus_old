package data

import (
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// CreateLabel creates a record in the datbase
func CreateLabel(label *models.Label) (err error) {
	_, err = ormObject.Insert(label)
	return
}

// Retrieve label from the database
func GetLabels(uid int, labels *[]models.Label) error {
	_, err := ormObject.QueryTable("label").Filter("Uid", uid).RelatedSel().All(labels)
	return err
}