package data

import (
	"bytes"
	"encoding/gob"
	"errors"
	"fmt"

	"github.com/imbaky/PatientFocus/core/domain/model"
	"github.com/syndtr/goleveldb/leveldb"
)

//Save registers the user
func SaveUser(user *model.User) error {
	db, err := leveldb.OpenFile("./data/levelDB", nil)
	if err != nil {
		return err
	}
	defer db.Close()
	var data bytes.Buffer
	enc := gob.NewEncoder(&data)
	enc.Encode(*user)

	err = db.Put([]byte(user.Email), data.Bytes(), nil)
	if err != nil {
		return errors.New(fmt.Sprintf("could not save user: %v", err))
	}
	return nil
}

// SavePatient saves the patient basic health info into the database and link its to the user
func SavePatient(patient *model.Patient) error { // TODO implement the database call
	return nil
}
