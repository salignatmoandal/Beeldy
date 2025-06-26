package config

import (
	"fmt"
	"os"
	"testing"

	"github.com/salignatmoandal/equipment-api/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect to test database: %v", err)
	}
	if err := db.AutoMigrate(&models.Equipment{}); err != nil {
		t.Fatalf("failed to migrate: %v", err)
	}
	return db
}

func TestCreateEquipmentPostgres(t *testing.T) {
	db := setupTestDB(t)

	eq := models.Equipment{
		Name:   "Test Equipment",
		Brand:  "Test Brand",
		Model:  "Model X",
		Status: "active",
	}

	if err := db.Create(&eq).Error; err != nil {
		t.Fatalf("failed to create equipment: %v", err)
	}

	var found models.Equipment
	if err := db.First(&found, "id = ?", eq.ID).Error; err != nil {
		t.Fatalf("failed to find equipment: %v", err)
	}

	if found.Name != eq.Name {
		t.Errorf("expected name %s, got %s", eq.Name, found.Name)
	}
}
