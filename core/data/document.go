package data

import (
    "fmt"
    "strings"
    "github.com/imbaky/PatientFocus/core/domain/model"
)

func GetDocumentsFromArray(docs []string) ([]model.Document, error) {

    db, err := GetConnection()
    if err != nil {
        return nil, fmt.Errorf("ValidateDocuments :%v", err)
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
        return nil, fmt.Errorf("Document query error :%v", err)
    }
    defer rows.Close()
    // add document information from database to a documents array
    var documents []model.Document
    for rows.Next() {
        var id int
        var url string
        var desc string
        err = rows.Scan(&id, &url, &desc)
        documents = append(documents, model.Document{Id: id, Url: url, Desc: desc})
    }

    return documents, nil
}
