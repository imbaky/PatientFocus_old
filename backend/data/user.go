package data

import "github.com/imbaky/PatientFocus/backend/domain/models"

func CreateUser(user *models.PFUser) (err error) {
	_, err = ormObject.Insert(user)
	return
}

func ReadUser(user *models.PFUser) error {
	u := *user
	return ormObject.QueryTable("PFUser").Filter("id", u.Id).One(user)
}

func AuthenticateUser(user *models.PFUser) error {
	return ormObject.Read(user, "email", "password")
}
