package db

import (
    "os"
    "errors"
    "fmt"
    "log"
    "database/sql"

    _ "github.com/lib/pq"
)

type Config struct {
    ConnectString string
}

func InitDb() (*pgDb, error) {
    // grab username and password from environment
    username := os.Getenv("POSTGRES_USER")
    password := os.Getenv("POSTGRES_PASSWORD")
    if username == "" || password == "" {
        err := errors.New("Missing username or password")
        log.Fatal(err)
        return nil, err
    }
    connection_info := fmt.Sprintf("postgres://%s:%s@db/user?sslmode=disable", username, password)
    db, err := sql.Open("postgres", connection_info)
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
