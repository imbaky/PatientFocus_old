package data

import "github.com/imbaky/PatientFocus/backend/domain/models"

func CreatePatient(patient *models.Patient) (err error) {
	_, err = ormObject.Insert(patient)
	return
}
