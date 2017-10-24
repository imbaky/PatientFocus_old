package data

import (
	"fmt"

	"github.com/imbaky/PatientFocus/core/domain/model"
)

// Get a user from the database and return a model
func GetUser(userid string) (user model.User) {

	db := GetConnection()
	if db == nil {
		return user
	}

	// should only return one
	var fname string
	var lname string
	err := db.QueryRow(`SELECT fname, lname FROM pfuser WHERE id = $1`, userid).Scan(&fname, &lname)
	if err != nil {
		return user
	}

	user.FirstName = fname
	user.LastName = lname

	return user
}

//Save registers the user
func SaveUser(user *model.User) (int, error) {
	db := GetConnection()
	if db == nil {
		return -1, fmt.Errorf("could not get database connection in SaveUser")
	}
	// for debug
	fmt.Println(user)
	var userid int
	err := db.QueryRow(`INSERT INTO pfuser (fname, lname, password, email)
				 VALUES ($1, $2, $3, $4) RETURNING id;`,
		user.FirstName,
		user.LastName,
		user.Password,
		user.Email,
	).Scan(&userid)
	return userid, err
}

//CreatePatient saves a patient in the database.
func CreatePatient(patient *model.Patient) (int, error) {
	db := GetConnection()
	if db == nil {
		return -1, fmt.Errorf("could not get database connection in CreatePatient")
	}
	// for debug
	fmt.Println(patient)
	var patientid int
	err := db.QueryRow(`INSERT INTO patient (race, gender, dob, language, smoke, problem_list, meds_list, allergy_list)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`,
		patient.Race,
		patient.Gender,
		patient.DateOfBirth,
		patient.Language,
		patient.Smoke,
		patient.ProblemList,
		patient.MedsList,
		patient.AlergyList,
	).Scan(&patientid)
	return patientid, err
}
