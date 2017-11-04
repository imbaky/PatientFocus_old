package models

import (
	"time"
)

//The Doctor struct holds all user data
type Doctor struct {
	Did int `orm:"pk;auto" json:"id"`
	Pid *PFUser `orm:"rel(fk);null" json:"pid"`
	Specialization string `json:"specialization"`
	License	int `json:"license"`
	DateCreated time.Time `orm:"auto_now_add;type(datetime)"`
	DateModified time.Time `orm:"auto_now;type(datetime)"`
}

type DoctorDocument struct {
	DoctorId   int `json:"doctor_id"`
	DocumentId int `json:"document_id"`
}
