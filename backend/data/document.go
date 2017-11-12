/*
Package data is used for all communication with the database.
This is ensuring a seperation of concernes. We achieve this by passing pointers to the
structures
*/
package data

import (
	"fmt"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// CreateDocument creates a document record in the database
func CreateDocument(document *models.Document) error {
	_, err := ormObject.Insert(document)
	return err
}

// GetDocumentsFromArray returns all the documents specified by the ids
func GetDocumentsFromArray(docs []int, documents *[]models.Document) error {

	var dynamic string
	for i := 0; i < len(docs); i++ {
		dynamic += "?, "
	}
	dynamic = dynamic[:len(dynamic)-2]
	query := fmt.Sprintf("SELECT did, url, desc FROM document WHERE did IN (%s)", dynamic)
	num, err := ormObject.Raw(query, docs).QueryRows(*documents)
	if err != nil {
		return fmt.Errorf("Could not get documents: %v", err)
	}
	if int(num) != len(docs) {
		return fmt.Errorf("Could not find all documents")
	}
	return nil
}
