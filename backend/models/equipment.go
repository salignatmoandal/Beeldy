package models

import (
	"time"
)

// Equipment représente un équipement enregistré dans la base
type Equipment struct {
	ID     string `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name   string `gorm:"not null" json:"name"`
	Brand  string `json:"brand"`
	Model  string `json:"model"`
	Status string `gorm:"default:'active'" json:"status"` // ex: active, maintenance, retired

	// Références hiérarchiques (type -> catégorie -> sous-catégorie)
	Domain      string `json:"domain"`       // ex: LEVAGE
	Type        string `json:"type"`         // ex: Ascenseur
	Category    string `json:"category"`     // ex: Électrique
	SubCategory string `json:"sub_category"` // ex: Traction

	// Pour la synchronisation offline
	Synced    bool      `gorm:"default:false" json:"synced"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
