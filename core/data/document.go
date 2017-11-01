package data

import (
    "fmt"
    "strings"
    "github.com/imbaky/PatientFocus/core/domain/model"
)

func GetDocumentsFromArray(docs []string, documents *[]model.Document) error {

    db, err := GetConnection()
    if err != nil {
        return fmt.Errorf("ValidateDocuments :%v", err)
    }

    getDocumentQuery := `SELECT
        id,
        url,
        description
    FROM document
    WHERE
        id = ANY($1::int[])`
    param := "{" + strings.Join(docs, ",") + "}"
    rows, err := db.Query(getDocumentQuery, param)
    if err != nil {
        return fmt.Errorf("Document query error :%v", err)
    }
    defer rows.Close()
    // add document information from database to a documents array
    for rows.Next() {
        var id int
        var url string
        var desc string
        err = rows.Scan(&id, &url, &desc)
        if err != nil {
            return fmt.Errorf("Error from database: %v", err)
        }
        *documents = append(*documents, model.Document{Id: id, Url: url, Desc: desc})
    }

    return nil
}

func InsertPatientDocument(document model.Document, patient model.Patient) error {
    db, err := GetConnection()
    if err != nil {
        return fmt.Errorf("Db connection problem :%v", err)
    }
    insertDocumentQuery := `INSERT INTO document
    (url,description,date_created,date_modified)
    VALUES($1,$2, $3, $4) RETURNING id`
    err = db.QueryRow(insertDocumentQuery, document.Url, document.Desc, document.Date_created, document.Date_modified).Scan(&document.Id)
    if err != nil {
        return fmt.Errorf("Error inserting document into database: %v", err)
    }
    associatePatientDocQuery := `INSERT INTO patient_document
    (patient, document) Values($1,$2)`
    _, err = db.Query(associatePatientDocQuery, patient.Id, document.Id)
    if err != nil {
        return fmt.Errorf("Error inserting associating patient and document in database: %v \n", err)
    }
    return nil
}
