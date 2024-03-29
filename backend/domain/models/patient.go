package models

import (
	"time"
)

//The Patient struct holds all basic patient info
type Patient struct {
	Ptid        int         `orm:"pk;auto" json:"id"`
	Race        string      `json:"race"`
	Gender      Gender      `json:"gender"`
	Language    Language    `json:"language"`
	DateOfBirth time.Time   `orm:"type(date);column(dob)" json:"dob"`
	Smoke       bool        `orm:"type(bool)" json:"smoke"`
	Documents   []*Document `orm:"rel(m2m)" json:"documents"`
	Doctors     []*Doctor   `orm:"rel(m2m)" json:"doctors"`
	// ProblemList string    `orm:"type(string)" json:"problem_list"`
	//	MedsList    []string  `json:"meds_list"`
	//	AllergyList []string  `json:"alergy_list"`
	DateCreated  time.Time `orm:"auto_now_add;type(datetime)"`
	DateModified time.Time `orm:"auto_now;type(datetime)"`
}

// TableName specifies how table name is to be called in the database
func (u *Patient) TableName() string {
	return "patient"
}

// PatientDoctor holds a patient doctor relationship
type PatientDoctor struct {
	PDoid   int      `orm:"pk;auto;column(pdoid)" json:"id"`
	Patient *Patient `orm:"rel(fk)" json:"patient_id"`
	Doctor  *Doctor  `orm:"rel(fk)" json:"doctor_id"`
}

// Gender is an enum of type string that is either male or female
type Gender string

// Language is an enum of type string that is either french or english
type Language string

const (
	//Male is a string enum that is part of the Gender enum
	Male Gender = "male"
	//Female is a string enum that is part of the Gender enum
	Female Gender = "female"
	//English is a string enum that is part of the Language enum
	English Language = "english"
	//French is a string enum that is part of the Language enum
	French Language = "french"
)
