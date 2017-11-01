package data

import (
	"fmt"

	"database/sql"

	"github.com/imbaky/PatientFocus/core/domain/model"
)

// GetUser from the database and return a model
func GetUser(user *model.User) error {
	patient := model.Patient{}
	doctor := model.Doctor{}
	db, err := GetConnection()
	if err != nil {
		return fmt.Errorf("GetUser :%v", err)
	}
	getUserQuery := `SELECT
	 pfuser.fname,
	 pfuser.lname,
	 pfuser.password,
	 pfuser.email,
	 patient.id,
	 patient.race,
	 patient.gender,
	 patient.dob,
	 patient.language,
	 patient.smoke
	FROM
	pfuser
	LEFT JOIN patient ON pfuser.id = patient.pfuser
	LEFT JOIN doctor on pfuser.id = doctor.pfuser
	WHERE
	pfuser.id= $1;`
	err = db.QueryRow(getUserQuery, user.Id).
		Scan(&user.FirstName,
			&user.LastName,
			&user.Password,
			&user.Email,
			&patient.Id,
			&patient.Race,
			&patient.Gender,
			&patient.DateOfBirth,
			&patient.Language,
			&patient.Smoke,
		)
	if err != nil {
		return fmt.Errorf("could not get user :%v", err)
	}
	user.Patient = &patient
	user.Doctor = &doctor
	return nil
}

func GetUserByEmail(user *model.User) error {
	doctor := model.Doctor{}
	db, err := GetConnection()
	if err != nil {
		return fmt.Errorf("GetUserByEmail :%v", err)
	}
	getUserQuery := `SELECT
	 pfuser.fname,
	 pfuser.lname,
	 pfuser.password,
	 pfuser.email,
	 doctor.id
	FROM
	 pfuser
	LEFT JOIN patient ON pfuser.id = patient.pfuser
	LEFT JOIN doctor on pfuser.id = doctor.pfuser
	WHERE
	 pfuser.email = $1;`
	err = db.QueryRow(getUserQuery, user.Email).
		Scan(&user.FirstName,
			&user.LastName,
			&user.Password,
			&user.Email,
			&doctor.Id,
		)
	if err != nil {
		return fmt.Errorf("could not get user :%v", err)
	}
	user.Doctor = &doctor
	return nil
}

//AuthenticateUser returns an error if no user is found with such credentials and nil if the user is found
func AuthenticateUser(user *model.User) error {
	db, err := GetConnection()
	if err != nil {
		return fmt.Errorf("AuthenticateUser :%v", err)
	}
	err = db.QueryRow(`SELECT id FROM pfuser WHERE email = $1 and password = $2`,
		user.Email,
		user.Password,
	).Scan(&user.Id)

	if err != nil && err != sql.ErrNoRows {
		return fmt.Errorf("could not find the user: %v %v", user.Email, user.Password)
	}
	return nil
}

//CreateUser the user
func CreateUser(user *model.User) error {
	db, err := GetConnection()
	if err != nil {
		return fmt.Errorf("SaveUser :%v", err)
	}
	// for debug
	fmt.Println(user)
	err = db.QueryRow(`INSERT INTO pfuser (fname, lname, password, email)
				 VALUES ($1, $2, $3, $4) RETURNING id;`,
		user.FirstName,
		user.LastName,
		user.Password,
		user.Email,
	).Scan(&user.Id)
	return err
}
