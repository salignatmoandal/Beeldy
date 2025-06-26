package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/salignatmoandal/equipment-api/controllers"
)

func RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/equipments", controllers.GetEquipments)          // Lire tous les équipements
		api.POST("/equipments", controllers.CreateEquipment)       // Créer un équipement
		api.GET("/equipments/:id", controllers.GetEquipmentByID)   // Lire un équipement spécifique
		api.PATCH("/equipments/:id", controllers.UpdateEquipment)  // Modifier un équipement
		api.DELETE("/equipments/:id", controllers.DeleteEquipment) // Supprimer un équipement

		// Sync offline (optionnel pour plus tard)
		// api.POST("/equipments/sync", controllers.SyncEquipments)
	}
}
