package data

import(
	"fmt"
	"encoding/gob"
	"bytes"
	"errors"
	"github.com/syndtr/goleveldb/leveldb"
	"github.com/imbaky/PatientFocus/core/domain/model"
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

	err = db.Put([]byte(user.Email), data.Bytes(),nil)
	if err != nil {
		return errors.New(fmt.Sprintf("could not save user: %v",err))
	}
	return nil
}
