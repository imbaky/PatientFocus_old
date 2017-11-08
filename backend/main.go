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
	// Open and intilialize log file to be written to.
	f, _ := os.Create("logfile.log")
	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
}

func main() {
	// Creates a gin router with default middleware:
	router := gin.New()

	// logger and recovery (crash-free) middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// Routes captured and handled
	router.POST("/auth/login", handlers.Login)
	router.POST("/user", handlers.CreateUser)
	router.POST("/label", handlers.CreateLabel)
	router.GET("/label/:lid", handlers.GetLabel)

	// Routes that require a session token
	router.Use(middlewares.Authenticate)
	router.GET("/user/:uid", handlers.GetUser)
	router.POST("/patient", handlers.CreatePatient)
	router.POST("/patientdocuments", handlers.GetSharedDocuments)
	router.POST("/document", handlers.UploadDocument)
	router.POST("/document/share", handlers.ShareDocument)
	
	router.Run(":9000")
}
