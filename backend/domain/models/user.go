package models

import (
	"time"
)

//PFUser struct holds all user data
type PFUser struct {
	Uid          int       `orm:"pk;auto" json:"id"`
	Email        string    `json:"email"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Password     string    `json:"password"`
	Patient      *Patient  `orm:"rel(fk);null"`
	Doctor       *Doctor   `orm:"rel(fk);null"`
	DateCreated  time.Time `orm:"auto_now_add;type(datetime)"`
	DateModified time.Time `orm:"auto_now;type(datetime)"`
}

// TableName specifies how table name is to be called in the database
func (u *PFUser) TableName() string {
	return "pfuser"
}
