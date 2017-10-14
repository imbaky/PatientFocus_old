package data

import(
	"fmt"
	"github.com/imbaky/PatientFocus/core/domain/model"
	"github.com/syndtr/goleveldb/leveldb"
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

func CreatePatient(patient *model.Patient) error {
	return nil
}
