package data

import (
	"fmt"

	"github.com/astaxie/beego/orm"
	"github.com/imbaky/PatientFocus/backend/domain/models"
)

// CreateLabel creates a record in the datbase
func CreateLabel(label *models.Label) (err error) {
	_, err = ormObject.Insert(label)
	return
}

// Retrieve label from the database
func GetLabels(uid int, labels *[]models.Label) error {
	_, err := ormObject.QueryTable("label").Filter("Uid", uid).RelatedSel().All(labels)
	return err
}

func LinkDocumentLabels(document *models.Document, labels []*models.Label) error {
	m2m := orm.NewOrm().QueryM2M(document, "Labels")
	_, err := m2m.Add(labels)
	return err
}

func ReadDocumentLabels(document *models.Document) error {
	fmt.Printf("document :%v\n", document)
	_, err := ormObject.LoadRelated(document, "Labels")
	return err
}
