package data

import (
	"fmt"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// CreatePatient creates a patient record in the database
func CreatePatient(patient *models.Patient) (err error) {
	_, err = ormObject.Insert(patient)
	return
}

// LinkDocumentPatient creates a link in the database between the patient and the document
func LinkDocumentPatient(document *models.Document, patient *models.PFUser) error {
	documentPatientLink := &models.PatientDocument{Patient: patient.Patient, Document: document}
	_, err := ormObject.Insert(documentPatientLink)
	return err
}

// PatientDoctorLinked checks if the doctor and the patient are connected
func PatientDoctorLinked(doctor, patient *models.PFUser) error {
	patientDoctorLink := &models.PatientDoctor{
		Patient: patient.Patient,
		Doctor:  doctor.Doctor}
	err := ormObject.Read(patientDoctorLink)
	return err
}

// LinkDoctorDocument creates a link in the database between the doctor and the document
func LinkDoctorDocument(user *models.PFUser, documents []models.Document) error {
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
	}
	return nil
}
