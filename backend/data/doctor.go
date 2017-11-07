package data

import "github.com/imbaky/PatientFocus/backend/domain/models"

// GetSharedDocuments returns a slice or pointers to documents that are shared by the doctor and patient used as input
func GetSharedDocuments(doctor, patient *models.PFUser) ([]*models.Document, error) {
	var documents []*models.Document
	_, err := ormObject.QueryTable("document").
		Filter("Patient__Patient__Ptid", patient.Patient.Ptid).
		Filter("Doctor__Doctor__Did", doctor.Doctor.Did).
		All(&documents)
	return documents, err
}
