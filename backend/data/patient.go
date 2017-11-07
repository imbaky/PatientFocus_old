package data

import (
	"fmt"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func CreatePatient(patient *models.Patient) (err error) {
	_, err = ormObject.Insert(patient)
	return
}

func LinkDocumentPatient(document *models.Document, patient *models.PFUser) error {
	documentPatientLink := &models.PatientDocument{Patient: patient.Patient, Document: document}
	_, err := ormObject.Insert(documentPatientLink)
	return err
}

func PatientDoctorLinked(doctor, patient *models.PFUser) error {
	patientDoctorLink := &models.PatientDoctor{
		Patient: patient.Patient,
		Doctor:  doctor.Doctor}
	err := ormObject.Read(patientDoctorLink)
	return err
}

func LinkDoctorDocument(user *models.PFUser, documents []models.Document) error {
	// build the values to insert
	var dDocuments []models.DoctorDocument

	for i := 0; i < len(documents); i++ {
		dDocuments[i].Doctor = user.Doctor
		dDocuments[i].Document = &documents[i]
	}
	// insert multi
	nums, err := ormObject.InsertMulti(len(documents), dDocuments)
	if err != nil {
		return fmt.Errorf("Could not link doctor to document")
	}
	if int(nums) != len(documents) {
		return fmt.Errorf("Could not insert all documents")
		// what do we do, remove what we did?
	}

	return nil
}
