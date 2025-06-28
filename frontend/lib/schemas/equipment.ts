import { z } from "zod"

// Schémas de base compatibles avec votre modèle Go
export const EquipmentStatusSchema = z.enum(["active", "maintenance", "inactive"])

export const EquipmentBaseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  domain: z.string().min(1, "Le domaine est requis"),
  type: z.string().min(1, "Le type est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  subCategory: z.string().min(1, "La sous-catégorie est requise"),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  status: EquipmentStatusSchema,
})

// Schéma pour la création (sans id et timestamps)
export const CreateEquipmentSchema = EquipmentBaseSchema

// Schéma pour la mise à jour (tous les champs optionnels)
export const UpdateEquipmentSchema = EquipmentBaseSchema.partial()

// Schéma complet avec id et timestamps (compatible avec votre modèle Go)
export const EquipmentSchema = EquipmentBaseSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string(), // Votre backend Go renvoie des timestamps en string
  updatedAt: z.string(),
})

// Schémas pour les filtres et la hiérarchie
export const EquipmentFiltersSchema = z.object({
  search: z.string().default(""),
  domain: z.string().default(""),
  type: z.string().default(""),
  category: z.string().default(""),
  subCategory: z.string().default(""),
})

export const EquipmentHierarchySchema = z.object({
  domains: z.record(z.string(), z.object({
    types: z.record(z.string(), z.object({
      categories: z.record(z.string(), z.object({
        subCategories: z.array(z.string())
      }))
    }))
  }))
})

// Types TypeScript dérivés des schémas
export type Equipment = z.infer<typeof EquipmentSchema>
export type CreateEquipment = z.infer<typeof CreateEquipmentSchema>
export type UpdateEquipment = z.infer<typeof UpdateEquipmentSchema>
export type EquipmentFilters = z.infer<typeof EquipmentFiltersSchema>
export type EquipmentHierarchy = z.infer<typeof EquipmentHierarchySchema>
export type EquipmentStatus = z.infer<typeof EquipmentStatusSchema>