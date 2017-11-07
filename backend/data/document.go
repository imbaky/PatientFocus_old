package data

import (
	"fmt"

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

func CreateDocument(document *models.Document) error {
	_, err := ormObject.Insert(&document)
	return err
}

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
