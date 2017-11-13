package model

//The Doctor struct holds all user data
type Doctor struct {
	Id int `json:"id"`
}

type DoctorDocument struct {
    DoctorId int `json:"doctor_id"`
    DocumentId int `json:"document_id"`
}
