package models

import (
	"time"
)

//The Patient struct holds all basic patient info
type Patient struct {
	Pid         int       `orm:"pk;auto" json:"id"`
	Race        string    `json:"race"`
	Gender      Gender    `json:"gender"`
	Language    Language  `json:"language"`
	DateOfBirth time.Time `json:"dob"`
	Smoke       bool      `orm:"type(bool) default(false)" json:"smoke"`
	ProblemList string    `orm:"type(jsonb)" json:"problem_list"`
	//	MedsList    []string  `json:"meds_list"`
	//	AllergyList []string  `json:"alergy_list"`
	DateCreated time.Time `orm:"auto_now_add;type(datetime)"`
	DateModified time.Time `orm:"auto_now;type(datetime)"`
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
