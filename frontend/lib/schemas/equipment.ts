import { z } from "zod"

// Base schemas compatible with your Go model
export const EquipmentStatusSchema = z.enum(["active", "maintenance", "inactive"])

export const EquipmentBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  domain: z.string().min(1, "Domain is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  status: EquipmentStatusSchema,
})

// Schema for creation (without id and timestamps)
export const CreateEquipmentSchema = EquipmentBaseSchema

// Schema for update (all fields optional)
export const UpdateEquipmentSchema = EquipmentBaseSchema.partial()

// Schema with id and timestamps 
export const EquipmentSchema = EquipmentBaseSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string(), //  Go returns timestamps as string
  updatedAt: z.string(),
})

// Schemas for filters and hierarchy
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

// Types TypeScript derived from schemas
export type Equipment = z.infer<typeof EquipmentSchema>
export type CreateEquipment = z.infer<typeof CreateEquipmentSchema>
export type UpdateEquipment = z.infer<typeof UpdateEquipmentSchema>
export type EquipmentFilters = z.infer<typeof EquipmentFiltersSchema>
export type EquipmentHierarchy = z.infer<typeof EquipmentHierarchySchema>
export type EquipmentStatus = z.infer<typeof EquipmentStatusSchema>