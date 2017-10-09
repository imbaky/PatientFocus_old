package db

import (
    "database/sql"
    "log"

    _ "github.com/lib/pq"
)

type Config struct {
    ConnectString string
}

func InitDb() (*pgDb, error) {
    db, err := sql.Open("postgres", "postgres://pf:patientfocus@db/user?sslmode=disable")
    if err != nil {
        log.Fatal(err)
        return nil, err
    }

    p := &pgDb{dbConn: db}

    if err := p.dbConn.Ping(); err != nil {
        return nil, err
    }
    if err := p.createTablesIfNotExist(); err != nil {
        return nil, err
    }

    return p, nil
}

type pgDb struct {
    dbConn *sql.DB
}

func (p *pgDb) createTablesIfNotExist() error {
    create_sql := `
       CREATE TABLE IF NOT EXISTS patient (
       id SERIAL NOT NULL PRIMARY KEY,
       fname TEXT NOT NULL,
       lname TEXT NOT NULL,
       dob TEXT NOT NULL,
       address TEXT NOT NULL,
       email TEXT NOT NULL,
       sex TEXT NOT NULL,
       role TEXT NOT NULL
       );
    `
    if rows, err := p.dbConn.Query(create_sql); err != nil {
        return err
    } else {
        rows.Close()
    }
    return nil
}
