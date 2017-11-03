package main

import (
    "github.com/gin-gonic/gin"
    "github.com/astaxie/beego/orm"
    "github.com/imbaky/PatientFocus/backend/data"
    "github.com/imbaky/PatientFocus/backend/domain/handlers"

)
var ORM orm.Ormer

func init() {
    data.ConnectToDb()
    ORM = data.GetOrmObject()
}

func main() {
    // Creates a gin router with default middleware:
    // logger and recovery (crash-free) middleware
    router := gin.Default()

    router.POST("/auth/login", handlers.Login)
    router.POST("/user", handlers.CreateUser)
    router.GET("/user/:uid", handlers.GetUser)

    // PORT environment variable was defined.
    router.Run(":9000")
}
