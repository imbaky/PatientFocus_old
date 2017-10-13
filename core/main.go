//Used to initilize the application
//i.e the server router and its endpoints.
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/imbaky/PatientFocus/core/data"
	"github.com/imbaky/PatientFocus/core/domain/handler"
)

//Initialize router and the endpoint as well as the database schema
func main() {
	fmt.Println("PatientFocus router is running")

	// Setup database
	err := data.InitDb()
	if err != nil {
		log.Printf("Error initializing database: %v\n", err)
		return
	}
	router := mux.NewRouter()
	router.HandleFunc("/user/{uid}", handlers.GetUser).Methods("GET")
	router.HandleFunc("/user", handlers.RegisterUser).Methods("POST")
	http.Handle("/", router)

	log.Fatal(http.ListenAndServe(":9000", nil))
}
