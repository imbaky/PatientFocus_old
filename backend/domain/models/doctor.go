package models

import (
	"time"
)

//The Doctor struct holds all user data
type Doctor struct {
	Did int `orm:"pk;auto" json:"id"`
	// Uid            *PFUser     `orm:"rel(fk);null;column(uid)" json:"uid"`
	Documents      []*Document `orm:"reverse(many)" json:"documents"`
	Specialization string      `json:"specialization"`
	License        int         `json:"license"`
	Patients       []*Patient  `orm:"reverse(many)" json:"patients"`
	DateCreated    time.Time   `orm:"auto_now_add;type(datetime)"`
	DateModified   time.Time   `orm:"auto_now;type(datetime)"`
}
