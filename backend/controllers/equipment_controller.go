package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/salignatmoandal/equipment-api/config"
	"github.com/salignatmoandal/equipment-api/models"
	"github.com/salignatmoandal/equipment-api/services"
)

// GET /api/equipments
func GetEquipments(c *gin.Context) {
	var equipments []models.Equipment
	result := config.DB.Find(&equipments)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération"})
		return
	}
	c.JSON(http.StatusOK, equipments)
}

// GET /api/equipments/:id
func GetEquipmentByID(c *gin.Context) {
	id := c.Param("id")
	var equipment models.Equipment
	result := config.DB.First(&equipment, "id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Équipement introuvable"})
		return
	}
	c.JSON(http.StatusOK, equipment)
}

// POST /api/equipments
func CreateEquipment(c *gin.Context) {
	var input models.Equipment
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := config.DB.Create(&input)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création"})
		return
	}
	c.JSON(http.StatusCreated, input)
}

// PATCH /api/equipments/:id
func UpdateEquipment(c *gin.Context) {
	id := c.Param("id")
	var equipment models.Equipment

	if err := config.DB.First(&equipment, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "[ERROR] Equipment not found"})
		return
	}

	var input models.Equipment
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mise à jour partielle
	config.DB.Model(&equipment).Updates(input)
	c.JSON(http.StatusOK, equipment)
}

// DELETE /api/equipments/:id
func DeleteEquipment(c *gin.Context) {
	id := c.Param("id")
	var equipment models.Equipment

	if err := config.DB.First(&equipment, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "[ERROR] Equipment not found"})
		return
	}

	config.DB.Delete(&equipment)
	c.JSON(http.StatusOK, gin.H{"deleted": true})
}

func EnrichEquipment(c *gin.Context) {
	var req struct {
		Name string `json:"name"`
		TopK int    `json:"top_k"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.TopK == 0 {
		req.TopK = 3
	}
	result, err := services.CallEnrichService(req.Name, req.TopK)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}
