package data

import (
	"fmt"

	"github.com/astaxie/beego/orm"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// CreatePatient creates a patient record in the database
func CreatePatient(patient *models.Patient) (err error) {
	_, err = ormObject.Insert(patient)
	return
}

func ReadPatient(patient *models.Patient) error {
	err := ormObject.Read(patient)
	if err != nil {
		return err
	}
	err = ReadPatientDocuments(patient)
	if err != nil {
		return err
	}

	return err
}

func ReadPatientDocuments(patient *models.Patient) error {
	_, err := ormObject.QueryTable("document").Filter("patient", patient.Ptid).RelatedSel().All(&patient.Documents)
	if err != nil {
		return err
	}
	for x := range patient.Documents {
		err = ReadDocumentLabels(patient.Documents[x])
		if err != nil {
			return err
		}
	}
	return err
}

func LinkPatientDoctor(doctor, patient *models.PFUser) error {
	m2m := orm.NewOrm().QueryM2M(doctor.Doctor, "Patients")
	_, err := m2m.Add(patient.Patient)
	if err != nil {
		return err
	}
	m2m = orm.NewOrm().QueryM2M(patient.Patient, "Doctors")
	_, err = m2m.Add(doctor.Doctor)
	return err
}

// PatientDoctorLinked checks if the doctor and the patient are connected
func PatientDoctorLinked(doctor, patient *models.PFUser) error {
	m2m := orm.NewOrm().QueryM2M(doctor.Doctor, "Patients")
	if m2m.Exist(patient.Patient) {
		return nil
	}
	return fmt.Errorf("Doctor and patient are not linked")
}

// LinkDoctorDocument creates a link in the database between the doctor and the document
func LinkDoctorDocument(doctor *models.PFUser, documents []models.Document) error {
	for _, document := range documents {
		m2m := orm.NewOrm().QueryM2M(&document, "Doctors")
		_, err := m2m.Add(doctor.Doctor)
		if err != nil {
			return err
		}
	}
	return nil
}
