package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/imbaky/PatientFocus/core/data"
	"github.com/imbaky/PatientFocus/core/domain/model"
)

//RegisterPatient is the endpoint that is used to save the patient to the database and create a link to their corresponding user entry
func RegisterPatient(rw http.ResponseWriter, req *http.Request) {
	var patient model.Patient
	err := json.NewDecoder(req.Body).Decode(&patient)
	defer req.Body.Close()
	if err != nil {
		fmt.Printf("%v", err)
		sendBoolResponse(rw, err)
		return
	}
	err = data.CreatePatient(&patient)
	sendBoolResponse(rw, err)
}
