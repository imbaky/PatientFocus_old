package models

// Label holds the label name and color of the label associated to a document
type Label struct {
	Lid  	int 		`orm:"pk;auto" json:"id"`
	Name 	string		`json:"name"`
	Color 	string		`json:"color"`
}
