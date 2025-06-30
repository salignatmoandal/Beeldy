package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/salignatmoandal/equipment-api/controllers"
)

// RegisterRoutes registers the routes for the equipment API
func RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/equipments", controllers.GetEquipments)                    // Retrieve all equipments
		api.POST("/equipments", controllers.CreateEquipment)                 // Create an equipment
		api.GET("/equipments/paginated", controllers.GetEquipmentsPaginated) // Get paginated equipments
		api.POST("/equipments/enrich", controllers.EnrichEquipment)          // Enrich an equipment
		api.GET("/equipments/:id", controllers.GetEquipmentByID)             // Retrieve an equipment by ID
		api.PATCH("/equipments/:id", controllers.UpdateEquipment)            // Update an equipment
		api.DELETE("/equipments/:id", controllers.DeleteEquipment)           // Delete an equipment

		// Sync offline (optionnel pour plus tard)
		// api.POST("/equipments/sync", controllers.SyncEquipments)
	}
}
