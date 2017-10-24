package model

//The User struct holds all user data
type User struct {
	Id        int    `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
	Patient   *Patient
	//Doctoer Doctor
}
