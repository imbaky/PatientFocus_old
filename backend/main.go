package main

import (
	"io"
	"os"

	"github.com/imbaky/PatientFocus/backend/domain/middlewares"

	"github.com/astaxie/beego/orm"
	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/handlers"
)

var ORM orm.Ormer

func init() {
	data.ConnectToDb()
	ORM = data.GetOrmObject()
	f, _ := os.Create("logfile.log")
	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
}

func main() {
	// Creates a gin router with default middleware:
	router := gin.New()

	// logger and recovery (crash-free) middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.POST("/auth/login", handlers.Login)
	router.POST("/user", handlers.CreateUser)

	router.Use(middlewares.Authenticate)
	router.GET("/user/:uid", handlers.GetUser)
	router.POST("/patient", handlers.CreatePatient)
	router.POST("/patientdocuments", handlers.GetSharedDocuments)
	router.POST("/document", handlers.UploadDocument)
	router.POST("/document/share", handlers.ShareDocument)
	router.Run(":9000")
}
