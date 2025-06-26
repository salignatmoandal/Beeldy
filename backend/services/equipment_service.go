package services

import (
	"errors"

	"github.com/salignatmoandal/equipment-api/config"
	"github.com/salignatmoandal/equipment-api/models"
)

// Retrieve all equipments
func GetAllEquipments() ([]models.Equipment, error) {
	var equipments []models.Equipment
	result := config.DB.Find(&equipments)
	return equipments, result.Error
}

// Retrieve an equipment by ID
func GetEquipmentByID(id string) (models.Equipment, error) {
	var equipment models.Equipment
	result := config.DB.First(&equipment, "id = ?", id)
	if result.Error != nil {
		return models.Equipment{}, errors.New("[ERROR] Equipment not found")
	}
	return equipment, nil
}

// Create a new equipment
func CreateEquipment(input models.Equipment) (models.Equipment, error) {
	result := config.DB.Create(&input)
	return input, result.Error
}

// Update an equipment
func UpdateEquipment(id string, data models.Equipment) (models.Equipment, error) {
	var equipment models.Equipment
	if err := config.DB.First(&equipment, "id = ?", id).Error; err != nil {
		return models.Equipment{}, errors.New("[ERROR] Equipment not found")
	}

	result := config.DB.Model(&equipment).Updates(data)
	return equipment, result.Error
}

// Delete an equipment
func DeleteEquipment(id string) error {
	var equipment models.Equipment
	if err := config.DB.First(&equipment, "id = ?", id).Error; err != nil {
		return errors.New("[ERROR] Equipment not found")
	}
	return config.DB.Delete(&equipment).Error
}
