// Réexport des types depuis les schémas Zod
export type { 
  Equipment, 
  EquipmentFilters, 
  EquipmentHierarchy,
  CreateEquipment,
  UpdateEquipment,
  EquipmentStatus 
} from "@/lib/schemas/equipment"

export type EnrichItem = {
  domain: string
  type: string
  category: string
  sub_category: string
  // Ajoute d'autres champs si besoin (name, distance, etc.)
}
