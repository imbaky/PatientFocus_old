package data

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"os/exec"

	_ "github.com/lib/pq"
)

var (
	username       = os.Getenv("POSTGRES_USER")
	password       = os.Getenv("POSTGRES_PASSWORD")
	driverName     = "postgres"
	dataSourceName = fmt.Sprintf("postgres://%s:%s@data/user?sslmode=disable", username, password)
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
	path, err := exec.LookPath("pg_ctl.exe")
	if err != nil {
		return err
	}
	cmd := exec.Command(path, "-d", "data/user", "-a", "-f", "INIT_TABLES.sql")
	return cmd.Run()
}

//GetConnection returns a connection to the database
func GetConnection() *sql.DB {
	db, err := sql.Open(driverName, dataSourceName)
	if err == nil {
		return db
	}
	return nil
}

//CloseConnection closes the connection to the database that is passed
func CloseConnection(conn *sql.DB) {
	conn.Close()
}
