package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv" // Loads environment variables from .env
	"gorm.io/driver/postgres"  // PostgreSQL driver for GORM
	"gorm.io/gorm"             // GORM ORM for database operations
)

// DB is a globally accessible GORM database instance.
// This allows all packages to reuse the same connection pool.
var DB *gorm.DB

// ConnectDB initializes the PostgreSQL connection using GORM.
// This should be called once during application startup.
func ConnectDB() {
	// Load .env if present, otherwise continue without error (Docker Compose injects already the variables)
	_ = godotenv.Load()

	// Build DSN (Data Source Name) from environment variables
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),     // e.g. localhost, db (Docker service), or Cloud SQL host
		os.Getenv("DB_USER"),     // e.g. dev
		os.Getenv("DB_PASSWORD"), // e.g. dev
		os.Getenv("DB_NAME"),     // e.g. beeldy_equipment
		os.Getenv("DB_PORT"),     // e.g. 5432
	)

	// Initialize connection to PostgreSQL via GORM
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("[ERROR] PostgreSQL connection failed: ", err)
	}

	// Assign the DB instance globally for reuse across the app
	DB = db

	log.Println("[INFO] PostgreSQL connection established successfully")
}
