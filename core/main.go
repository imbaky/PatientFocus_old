//Used to initilize the application
//i.e the server router and its endpoints.
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/imbaky/PatientFocus/core/configuration"
	"github.com/imbaky/PatientFocus/core/domain/handler"
	"github.com/imbaky/PatientFocus/core/domain/midware"
)

var (
	chain           = midware.Chain
	session         = midware.CheckSession()
	logInfo         = midware.LogInfo()
	login           = handlers.Login
	getUser         = handlers.GetUser
	registerUser    = handlers.RegisterUser
	registerPatient = handlers.RegisterPatient
	receiveDoc      = handlers.ReceiveDocument
  shareDoc        = handlers.ShareDocument
  getSharedDocs   = handlers.GetSharedDocuments
)

//Initialize router and the endpoint as well as the database schema
func main() {
	fmt.Println("PatientFocus router is running")

	router := mux.NewRouter()
	router.HandleFunc("/document", chain(receiveDoc, logInfo, session)).Methods("POST")
  router.HandleFunc("/document/share", chain(shareDoc, logInfo, session)).Methods("POST")
	router.HandleFunc("/user/{uid}", chain(getUser, logInfo, session)).Methods("GET")
  router.HandleFunc("/auth/login", chain(login, logInfo)).Methods("POST")
	router.HandleFunc("/auth/register", chain(registerUser, logInfo)).Methods("POST")
	router.HandleFunc("patient", chain(registerPatient, logInfo)).Methods("POST")
	router.HandleFunc( "/patientdocuments", chain(getSharedDocs, logInfo, session)).Methods("POST")

	http.Handle("/", router)
	log.Fatal(http.ListenAndServeTLS(":9000", configuration.DirectoryForCertificate, configuration.DirectoryForKey, nil))
}
