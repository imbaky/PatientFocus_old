package models

//The Doctor struct holds all user data
type Doctor struct {
	Did int `orm:"pk" json:"id"`
}

type DoctorDocument struct {
	DoctorId   int `json:"doctor_id"`
	DocumentId int `json:"document_id"`
}
