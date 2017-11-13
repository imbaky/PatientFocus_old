package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
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

//token that is returned
type token struct {
	Token string `json:"token"`
}

//GetUser returns the user model given the userId
func GetUser(rw http.ResponseWriter, req *http.Request) {
	var user model.User
	params := mux.Vars(req)
	id, err := strconv.Atoi(params["uid"])
	user.Id = id
	if err != nil {
		sendBoolResponse(rw, fmt.Errorf("id is not a number"))
	}
	err = data.GetUser(&user)
	if err != nil {
		// send 404
		rw.WriteHeader(http.StatusNotFound)
		rw.Write([]byte(err.Error()))
		return
	}
	json.NewEncoder(rw).Encode(user)
}

//Login endpoint authenticates and returns a token
func Login(rw http.ResponseWriter, req *http.Request) {
	var user model.User
	err := json.NewDecoder(req.Body).Decode(&user)
	defer req.Body.Close()
	err = data.AuthenticateUser(&user)
	if err != nil {
		sendBoolResponse(rw, err)
		return
	}
	tkn, err := data.GetSession(&user)
	if err != nil {
		sendBoolResponse(rw, err)
		return
	}
	response, err := json.Marshal(token{tkn})
	if err != nil {
		sendBoolResponse(rw, err)
		return
	}
	rw.Header().Set("Content-type", "application/json")
	rw.WriteHeader(http.StatusOK)
	rw.Write([]byte(response))
}

//RegisterUser is an endpoint to create the user and persist it
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
	err = data.CreateUser(&user)
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
