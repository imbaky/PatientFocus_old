package data

import (
	"fmt"
	"os"

	"github.com/astaxie/beego/orm"
	_ "github.com/lib/pq" //PostgreSQL Driver

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

var ormObject orm.Ormer

var (
	username       = os.Getenv("POSTGRES_USER")
	password       = os.Getenv("POSTGRES_PASSWORD")
	dbName         = os.Getenv("POSTGRES_DB")
	host           = os.Getenv("POSTGRES_HOST")
	driverName     = "postgres"
	dataSourceName = fmt.Sprintf("postgres://%s:%s@db/patientfocus?sslmode=disable", username, password)
)

// ConnectToDb - Initializes the ORM and Connection to the postgres DB
func ConnectToDb() {
	orm.RegisterDriver("postgres", orm.DRPostgres)
	dbInfo := fmt.Sprintf("user=%s password=%s dbname=%s host=%s sslmode=disable", username, password, dbName, host)
	orm.RegisterDataBase("default", driverName, dbInfo)
	orm.RegisterModel(
		new(models.PFUser), 
		new(models.Patient), 
		new(models.Doctor), 
		new(models.Document),
		new(models.DoctorDocument),
	)
	orm.RunSyncdb("default", false, true)
	ormObject = orm.NewOrm()
}

// GetOrmObject - Getter function for the ORM object with which we can query the database
func GetOrmObject() orm.Ormer {
	return ormObject
}
