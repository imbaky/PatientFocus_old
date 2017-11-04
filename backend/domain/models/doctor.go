package models

import (
	"time"
)

//The Doctor struct holds all user data
type Doctor struct {
	Did int     		`orm:"pk;auto" json:"id"`
	Uid *PFUser 		`orm:"rel(fk);null;column(uid)" json:"uid"`
	Specialization string `json:"specialization"`
	License	int    		`json:"license"`
	DateCreated time.Time `orm:"auto_now_add;type(datetime)"`
	DateModified time.Time `orm:"auto_now;type(datetime)"`
}

type DoctorDocument struct {
	DDid     int       `orm:"pk;auto;column(ddid)" json:"id"`
	Doctor   *Doctor   `orm:"rel(fk)" json:"doctor_id"`
	Document *Document `orm:"rel(fk)" json:"document_id"`
}
