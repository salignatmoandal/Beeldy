package controllers

import (
	"math"
	"net/http"
	"strconv"

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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving equipments"})
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
		c.JSON(http.StatusNotFound, gin.H{"error": "Equipment not found"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating equipment"})
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

// POST /api/equipments/enrich
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

// GET /api/equipments/paginated
func GetEquipmentsPaginated(c *gin.Context) {
	// Récupérer les paramètres de pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "50"))

	// Récupérer les paramètres de filtrage
	search := c.Query("search")
	domain := c.Query("domain")
	type_ := c.Query("type")
	category := c.Query("category")
	subCategory := c.Query("sub_category")
	status := c.Query("status")

	// Limiter la taille de page pour éviter la surcharge
	if pageSize > 100 {
		pageSize = 100
	}

	var equipments []models.Equipment
	var total int64

	query := config.DB.Model(&models.Equipment{})

	// Apply filters
	if search != "" {
		query = query.Where("name ILIKE ? OR brand ILIKE ? OR model ILIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}
	if domain != "" {
		query = query.Where("domain = ?", domain)
	}
	if type_ != "" {
		query = query.Where("type = ?", type_)
	}
	if category != "" {
		query = query.Where("category = ?", category)
	}
	if subCategory != "" {
		query = query.Where("sub_category = ?", subCategory)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Count the total equipments (with the applied filters)
	query.Count(&total)

	// Pagination with creation date sorting (the most recent first)
	offset := (page - 1) * pageSize
	result := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&equipments)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving equipments"})
		return
	}

	// Calculate the total number of pages
	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	// Return the paginated response
	c.JSON(http.StatusOK, gin.H{
		"data": equipments,
		"pagination": gin.H{
			"page":       page,
			"pageSize":   pageSize,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}
