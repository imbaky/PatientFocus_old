package data

import(
	"fmt"
	"github.com/imbaky/PatientFocus/core/domain/model"
)

//Save registers the user
func SaveUser(user *model.User) error {
	db := GetConnection()
	if db == nil {
		return nil
	}

	// for debug
	fmt.Println(user)

	var userid int
	err := db.QueryRow(`INSERT INTO pfuser (fname, lname, password, email)
	             VALUES ($1, $2, $3, $4) RETURNING id;`, user.FirstName, user.LastName, user.Password, user.Email).Scan(&userid)
	if err != nil {
		fmt.Println(err)
		return err
	}

	// should log userid


	return err
}
