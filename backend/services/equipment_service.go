package services

import (
	"errors"

	"github.com/salignatmoandal/equipment-api/config"
	"github.com/salignatmoandal/equipment-api/models"
)

// Récupérer tous les équipements
func GetAllEquipments() ([]models.Equipment, error) {
	var equipments []models.Equipment
	result := config.DB.Find(&equipments)
	return equipments, result.Error
}

// Récupérer un équipement par ID
func GetEquipmentByID(id string) (models.Equipment, error) {
	var equipment models.Equipment
	result := config.DB.First(&equipment, "id = ?", id)
	if result.Error != nil {
		return models.Equipment{}, errors.New("équipement introuvable")
	}
	return equipment, nil
}

// Créer un nouvel équipement
func CreateEquipment(input models.Equipment) (models.Equipment, error) {
	result := config.DB.Create(&input)
	return input, result.Error
}

// Mettre à jour un équipement
func UpdateEquipment(id string, data models.Equipment) (models.Equipment, error) {
	var equipment models.Equipment
	if err := config.DB.First(&equipment, "id = ?", id).Error; err != nil {
		return models.Equipment{}, errors.New("équipement non trouvé")
	}

	result := config.DB.Model(&equipment).Updates(data)
	return equipment, result.Error
}

// Supprimer un équipement
func DeleteEquipment(id string) error {
	var equipment models.Equipment
	if err := config.DB.First(&equipment, "id = ?", id).Error; err != nil {
		return errors.New("équipement non trouvé")
	}
	return config.DB.Delete(&equipment).Error
}
