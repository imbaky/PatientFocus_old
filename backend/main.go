package main

import (
	"io"
	"os"

	"github.com/astaxie/beego/orm"
	"github.com/gin-gonic/gin"
	"github.com/imbaky/PatientFocus/backend/data"
	"github.com/imbaky/PatientFocus/backend/domain/handlers"
	"github.com/imbaky/PatientFocus/backend/domain/middlewares"
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

	// group middleware for authorization
	authorized := router.Group("/")
	authorized.Use(middlewares.Authenticate)
	{
		router.GET("/user/:uid", handlers.GetUser)
		router.POST("/patient", handlers.CreatePatient)
	}
	router.Run(":9000")
}
