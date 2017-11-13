package data

import "github.com/imbaky/PatientFocus/backend/domain/models"

// CreateUser creates a record in the datbase of a new user
func CreateUser(user *models.PFUser) (err error) {
	_, err = ormObject.Insert(user)
	return
}

// ReadUser reads the user from the database and populates the structed that is passed
// If the username and password is populated it will do it that way otherwise it will get it using the uid
func ReadUser(user *models.PFUser) error {
	if user.Email == "" && user.Password == "" {
		err := ormObject.Read(user)
		if err != nil {
			return err
		}
		if user.Patient != nil {
			err = ormObject.Read(user.Patient)
			if err != nil {
				return err
			}
			err = ReadPatientDocuments(user.Patient)
			if err != nil {
				return err
			}
		}

		if user.Doctor != nil {
			err = ormObject.Read(user.Doctor)
			if err != nil {
				return err
			}
			err = ReadDoctorDocuments(user.Doctor)
			if err != nil {
				return err
			}
		}
		return err
	}
	return ormObject.Read(user, "email")
}

// AssociatePatient creates an association between the patient and the user structure
func AssociatePatient(user *models.PFUser) error {
	_, err := ormObject.Update(user, "patient_id")
	return err
}

// AssociateDoctor creates an association between the doctor and the user structure
func AssociateDoctor(user *models.PFUser) error {
	_, err := ormObject.Update(user, "doctor_id")
	return err
}
