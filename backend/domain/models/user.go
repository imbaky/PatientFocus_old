package models

//The User struct holds all user data
type PFUser struct {
	Id        int    `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
	Patient   *Patient
	Doctor    *Doctor
}
