package main

import (
	"io"
	"os"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/middlewares"
	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/domain/handlers"
	"github.com/gin-contrib/cors"
)

func init() {
	// Open and intilialize log file to be written to.
	f, _ := os.Create("logfile.log")
	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
}

func main() {
	data.Init()
	// Creates a gin router with default middleware:
	router := gin.New()

	// logger and recovery (crash-free) middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(cors.Default())

	// Routes captured and handled
	router.POST("/auth/login", handlers.Login)
	router.POST("/auth/register", handlers.CreateUser)
	
	// Routes that require a session token
	router.Use(middlewares.Authenticate)
	router.GET("/user/:uid", handlers.GetUser)
	router.GET("/patient/:id",handlers.GetPatient)
	router.POST("/patient", handlers.CreatePatient)
	router.POST("/doctor", handlers.CreateDoctor)
	router.GET("/doctor/patients", handlers.GetDoctorPatients)
	router.POST("/patientdocuments", handlers.GetSharedDocuments)
	router.POST("/document/upload", handlers.UploadDocument)
	router.GET("/document/:id", handlers.GetDocument)
	router.POST("/document/share", handlers.ShareDocument)
	router.POST("/document/labels", handlers.LinkDocumentLabels)
	router.POST("/label", handlers.CreateLabel)
	router.GET("/label", handlers.GetLabels)
	
	router.Run(":9000")
}
