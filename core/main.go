//Used to initilize the application
//i.e the server router and its endpoints.
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/imbaky/PatientFocus/core/domain/handler"
)

//Initialize router and the endpoint as well as the database schema
func main() {
	fmt.Println("PatientFocus router is running")
	router := mux.NewRouter()
	router.HandleFunc("/User", handlers.RegisterUser).Methods("POST")
	http.Handle("/", router)

	log.Fatal(http.ListenAndServe(":9000", nil))
}