package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/salignatmoandal/equipment-api/config"
	"github.com/salignatmoandal/equipment-api/models"
	"github.com/salignatmoandal/equipment-api/routes"
)

func main() {
	// Connexion à la base de données PostgreSQL
	config.ConnectDB()

	// Migration automatique des modèles
	err := config.DB.AutoMigrate(&models.Equipment{})
	if err != nil {
		log.Fatal("❌ Échec de la migration GORM : ", err)
	}

	// Initialisation du routeur Gin
	r := gin.Default()

	// Enregistrement des routes
	routes.RegisterRoutes(r)

	// Lancement du serveur sur le port 3000
	if err := r.Run(":3000"); err != nil {
		log.Fatal("❌ Échec du lancement du serveur : ", err)
	}
}
