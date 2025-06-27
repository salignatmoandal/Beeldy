package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/salignatmoandal/equipment-api/config"
	"github.com/salignatmoandal/equipment-api/models"
	"github.com/salignatmoandal/equipment-api/routes"
)

func main() {
	// Connexion to database
	config.ConnectDB()

	// Automatic migration of models
	err := config.DB.AutoMigrate(&models.Equipment{})
	if err != nil {
		log.Fatal("❌ Error migrating GORM : ", err)
	}

	// Initialisation of the Gin router
	r := gin.Default()

	// Enregistrement des routes
	routes.RegisterRoutes(r)

	// Launching the server on port 3000
	if err := r.Run(":3000"); err != nil {
		log.Fatal("❌ Error launching the server : ", err)
	}
}
