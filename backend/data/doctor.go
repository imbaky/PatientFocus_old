package data

import "github.com/imbaky/PatientFocus/backend/domain/models"

// CreateDoctor creates a doctor record in the database
func CreateDoctor(doctor *models.Doctor) (err error) {
	_, err = ormObject.Insert(doctor)
	return
}

// GetSharedDocuments returns a slice or pointers to documents that are shared by the doctor and patient used as input
func GetSharedDocuments(doctor *models.PFUser, patient *models.Patient) ([]*models.Document, error) {
	documents := []*models.Document{}
	err := ReadDoctorDocuments(doctor.Doctor)
	if err != nil {
		return nil, err
	}
	err = ReadPatientDocuments(patient)
	if err != nil {
		return nil, err
	}
	for _, ddoc := range doctor.Doctor.Documents {
		for _, pdoc := range patient.Documents {
			if pdoc.Did == ddoc.Did {
				documents = append(documents, ddoc)
			}
		}
	}
	return documents, nil
}

func ReadDoctorDocuments(doctor *models.Doctor) error {
	err := ormObject.Read(doctor)
	_, err = ormObject.LoadRelated(doctor, "Documents")
	return err
}
