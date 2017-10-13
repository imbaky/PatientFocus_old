package data

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"io/ioutil"

	_ "github.com/lib/pq"
)

var (
	username       = os.Getenv("POSTGRES_USER")
	password       = os.Getenv("POSTGRES_PASSWORD")
	driverName     = "postgres"
	dataSourceName = fmt.Sprintf("postgres://%s:%s@db/patientfocus?sslmode=disable", username, password)
)

// InitDb initializes the database if it not yet initialized
func InitDb() error {
	if username == "" || password == "" {
		err := errors.New("Missing username or password")
		return err
	}

	db, err := sql.Open(driverName, dataSourceName)
	if err != nil {
		return err
	}

	if err := db.Ping(); err != nil {
		return err
	}

	err = createTablesIfNotExist(db)
	return err
}

//createTablesInNotExist creates the tables in the database running the sql script INIT_TABLES.sql
func createTablesIfNotExist(db *sql.DB) error {
	dat, err := ioutil.ReadFile("data/INIT_TABLES.sql")
	if err != nil {
		return err
	}
	if rows, err := db.Query(string(dat)); err != nil {
		return err
	} else {
		rows.Close()
	}
	return nil
}

//GetConnection returns a connection to the database
func GetConnection() *sql.DB {
	db, err := sql.Open(driverName, dataSourceName)
	if err != nil {
		return nil
	}
	return db
}

//CloseConnection closes the connection to the database that is passed
func CloseConnection(conn *sql.DB) {
	conn.Close()
}
