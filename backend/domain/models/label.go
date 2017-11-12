package models

// Label holds the label name and color of the label associated to a document
type Label struct {
	Lid  		int 		`orm:"pk;auto" json:"id"`
	Uid			*PFUser		`orm:"rel(fk);column(uid);null" json:"uid"`
	Name 		string		`json:"name"`
	Color 		string		`json:"color"`
	Documents 	[]*Document `orm:"reverse(many)" json:"documents"`
}
