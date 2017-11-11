package models

import (
	"time"
)

// Document holds information of one document
type Document struct {
	Did          int       `orm:"pk;auto" json:"id"`
	FileName     string    `json:"filename"`
	Url          string    `json:"url"`         // path and filename
	Description  string    `json:"description"` // short description of file (optional)
	MimeType     string    `json:"mimetype"`
	Size         int       `json:"Size"` // in bytes
	Patient      *Patient  `orm:"rel(fk);null" json:"patient"`
	Doctors      []*Doctor `orm:"rel(m2m);null" json:"doctors"`
	Labels       []*Label  `orm:"rel(m2m);null" json:"labels"`
	DateCreated  time.Time `orm:"auto_now_add;type(datetime)"`
	DateModified time.Time `orm:"auto_now;type(datetime)"`
}
