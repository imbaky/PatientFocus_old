package model

// Holds information of one document
type Document struct {
	Id        int    `json:"id"`
	Url       string `json:"url"`  // path and filename
	Desc      string `json:"description"` // short description of file (optional)
	Date_created string
	Date_modified string
}
