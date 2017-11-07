package models

import (
	"time"
)

// Holds information of one document
type Document struct {
	Did       		int    `orm:"pk;auto" json:"id"`
	FileName		string `json:"filename"`
	Url       		string `json:"url"`  // path and filename
	Description 	string `json:"description"` // short description of file (optional)
	MimeType		string `json:"mimetype"`
	Size			int	   `json:"Size"` // in bytes
	DateCreated 	time.Time `orm:"auto_now_add;type(datetime)"`
	DateModified 	time.Time `orm:"auto_now;type(datetime)"`
}

type DocumentLabel struct {
	Did       int    	`orm:"pk;auto" json:"id"`
	Document *Document 	`orm:"rel(fk)" json:"document_id"`
	Label	 *Label		`orm:"rel(fk)" json:"label_id"`
}