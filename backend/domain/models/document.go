package models

import (
	"time"
)

// Holds information of one document
type Document struct {
	Did       int    `orm:"pk;auto" json:"id"`
	Url       string `json:"url"`  // path and filename
	Desc      string `json:"description"` // short description of file (optional)
	DateCreated time.Time `orm:"auto_now_add;type(datetime)"`
	DateModified time.Time `orm:"auto_now;type(datetime)"`
}
