package data

import (
	"fmt"

	"github.com/imbaky/PatientFocus/core/domain/model"
)

//CreatePatient saves a patient in the database.
func CreatePatient(patient *model.Patient) error {
	db, err := GetConnection()
	if err != nil {
		return fmt.Errorf("CreatePatient :%v", err)
	}
	// for debug
	fmt.Println(patient)
	err = db.QueryRow(`INSERT INTO patient (race, gender, dob, language, smoke, problem_list, meds_list, allergy_list)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`,
		patient.Race,
		patient.Gender,
		patient.DateOfBirth,
		patient.Language,
		patient.Smoke,
		patient.ProblemList,
		patient.MedsList,
		patient.AllergyList,
	).Scan(&patient.Id)
	return err
}

func LinkDoctorDocument(user model.User, documents[]model.Document) error {
	db, err := GetConnection()
	if err != nil {
		return fmt.Errorf("LinkDoctorDocument")
	}

	linkQuery := "INSERT INTO doctor_document VALUES ($1, $2)"
	// insert one at a time, revisit for multiple inserts
	for i := 0; i < len(documents); i++ {
		stmt, _ := db.Prepare(linkQuery)
		_, err = stmt.Exec(user.Doctor.Id, documents[i].Id)
		stmt.Close()
	}

	return nil
}