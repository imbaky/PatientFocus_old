package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/imbaky/PatientFocus/core/data"
	"github.com/imbaky/PatientFocus/core/domain/model"
	"github.com/imbaky/PatientFocus/core/domain/security"
)

/*
Success or fail json enabled response
*/
type boolResponse struct {
	Success bool `json:"success"`
}

func RegisterUser(rw http.ResponseWriter, req *http.Request) {
	var user model.User
	err := json.NewDecoder(req.Body).Decode(&user)
	defer req.Body.Close()
	if err != nil {
		fmt.Printf("%v", err)
		sendBoolResponse(rw, err)
		return
	}
	security.EncryptPassword(&user)
	err = data.SaveUser(&user)
	sendBoolResponse(rw, err)
}

func RegisterPatient(rw http.ResponseWriter, req *http.Request) {
	var patient model.Patient
	err := json.NewDecoder(req.Body).Decode(&patient)
	defer req.Body.Close()
	if err != nil {
		fmt.Printf("%v", err)
		sendBoolResponse(rw, err)
		return
	}
	err = data.SavePatient(&patient)
	sendBoolResponse(rw, err)
}

/*
Returns a boolean response depending on the error passed in JSON format.
looks like {"success":false/true}
*/
func sendBoolResponse(rw http.ResponseWriter, err error) {
	rw.Header().Set("Content-type", "application/json")
	var response []byte

	if err != nil {
		response, _ = json.Marshal(boolResponse{false})
		rw.Write(response)
		return
	}

	if response, err = json.Marshal(boolResponse{true}); err != nil {
		fmt.Printf("%v\n", err)
	}

	// fmt.Printf("%v\n", response)
	rw.Write(response)
}
