package data

import (
	"github.com/astaxie/beego/orm"
	"github.com/imbaky/PatientFocus/core/domain/model"
	_ "github.com/lib/pq" //PostgreSQL Driver

	"github.com/imbaky/PatientFocus/backend/domain/models"
)

var ormObject orm.Ormer

// ConnectToDb - Initializes the ORM and Connection to the postgres DB
func ConnectToDb() {
	orm.RegisterDriver("postgres", orm.DRPostgres)
	orm.RegisterDataBase("default", "postgres", "user=pf password=patientfocus dbname=patientfocus host=localhost sslmode=disable")
	orm.RegisterModel(new(models.PFUser), new(model.Patient), new(models.Doctor))
	orm.RunSyncdb("default", false, true)
	ormObject = orm.NewOrm()
}

// GetOrmObject - Getter function for the ORM object with which we can query the database
func GetOrmObject() orm.Ormer {
	return ormObject
}
