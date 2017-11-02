package data

import (
	"bitbucket.org/DavidDube/mbarter/mBarterCore/domain/models"
	"github.com/imbaky/PatientFocus/core/domain/model"
)

func CreateUser(user *models.PFUser) (err error) {
	_, err = ormObject.Insert(user)
	return
}

func ReadUser(user *model.PFUser) error {
	u := *user
	return ormObject.QueryTable("PFUser").Filter("id", u.Id).One(user)
}
