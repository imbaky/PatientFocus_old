package data

import (
	"fmt"
	"github.com/imbaky/PatientFocus/core/domain/model"
)

func GetSharedDocuments(doctor *model.User, patient *model.User, urls *[]string) error{
	db, err := GetConnection()
	if err != nil {
		return fmt.Errorf("GetSharedDocuments :%v", err)
	}
	query := `SELECT document.url
	FROM
	document, doctor_document, patient_document, doctor, patient
	WHERE
	document.id = doctor_document.document AND
	document.id = patient_document.document AND
	doctor.id = $1 AND patient.id = $2`
	urlRows , err := db.Query(query, doctor.Doctor.Id, patient.Patient.Id)
	if err != nil {
		return fmt.Errorf("GetSharedDocuments :%v", err)
	}
	defer urlRows.Close()
	for urlRows.Next() {
		var url string
		err = urlRows.Scan(&url)
		if err != nil {
			return fmt.Errorf("GetSharedDocuments :%v", err)
		}
		*urls = append(*urls, url)
	}
	return nil

}