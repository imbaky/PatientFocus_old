package model

// Holds information of one document
type Document struct {
	PatientId int    `json:"pid"`
	RecordId  int    `json:"rid"`
	Url       string `json:"url"`  // path and filename
	Desc      string `json:"desc"` // short description of file (optional)
}
