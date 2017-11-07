package models

type Label struct {
	Lid  	int 		`orm:"pk;auto" json:"id"`
	Name 	string		`json:"name"`
	Color 	string		`json:"color"`
}
