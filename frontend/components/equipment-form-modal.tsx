"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { EnrichItem, Equipment, EquipmentHierarchy } from "@/types/equipment"
import { EquipmentAPI } from "@/lib/services/equiment-api"


interface EquipmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (equipment: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => Promise<void>
  equipment?: Equipment | null
  hierarchy: EquipmentHierarchy
  setHierarchy: React.Dispatch<React.SetStateAction<EquipmentHierarchy>>
}

interface FormData {
  name: string
  domain: string
  type: string
  category: string
  subCategory: string
  brand: string
  model: string
  status: Equipment["status"]
}
function enrichResultsToHierarchy(results: EnrichItem[]): EquipmentHierarchy {
  const hierarchy: EquipmentHierarchy = { domains: {} }
  results.forEach((item) => {
    if (!item.domain) return
    if (!hierarchy.domains[item.domain]) {
      hierarchy.domains[item.domain] = { types: {} }
    }
    if (!item.type) return
    if (!hierarchy.domains[item.domain].types[item.type]) {
      hierarchy.domains[item.domain].types[item.type] = { categories: {} }
    }
    if (!item.category) return
    if (!hierarchy.domains[item.domain].types[item.type].categories[item.category]) {
      hierarchy.domains[item.domain].types[item.type].categories[item.category] = { subCategories: [] }
    }
    if (
      item.sub_category &&
      !hierarchy.domains[item.domain].types[item.type].categories[item.category].subCategories.includes(item.sub_category)
    ) {
      hierarchy.domains[item.domain].types[item.type].categories[item.category].subCategories.push(item.sub_category)
    }
  })
  return hierarchy
}

export function EquipmentFormModal({ isOpen, onClose, onSubmit, equipment, hierarchy, setHierarchy }: EquipmentFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    domain: "",
    type: "",
    category: "",
    subCategory: "",
    brand: "",
    model: "",
    status: "active",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        domain: equipment.domain,
        type: equipment.type,
        category: equipment.category,
        subCategory: equipment.subCategory,
        brand: equipment.brand,
        model: equipment.model,
        status: equipment.status,
      })
    } else {
      setFormData({
        name: "",
        domain: "",
        type: "",
        category: "",
        subCategory: "",
        brand: "",
        model: "",
        status: "active",
      })
    }
    setErrors({})
  }, [equipment, isOpen])

  useEffect(() => {
    if (formData.name && formData.name.length > 2) {
      EquipmentAPI.enrichEquipment(formData.name)
        .then((result) => {
          const hierarchy = enrichResultsToHierarchy(result?.results || [])
          setHierarchy(hierarchy)
        })
        .catch(() => {
          setHierarchy({ domains: {} })
        })
    }
  }, [formData.name, setHierarchy])

  const domains = Object.keys(hierarchy?.domains || {})
  const types = formData.domain ? Object.keys(hierarchy.domains[formData.domain]?.types || {}) : []
  const categories =
    formData.domain && formData.type
      ? Object.keys(hierarchy.domains[formData.domain]?.types[formData.type]?.categories || {})
      : []
  const subCategories =
    formData.domain && formData.type && formData.category
      ? hierarchy?.domains?.[formData.domain]?.types?.[formData.type]?.categories?.[formData.category]?.subCategories ?? []
      : []

  console.log(
    "subCategories = ",
    hierarchy?.domains?.[formData.domain]?.types?.[formData.type]?.categories?.[formData.category]?.subCategories
  )

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Reset dependent fields when parent changes
      if (field === "domain") {
        newData.type = ""
        newData.category = ""
        newData.subCategory = ""
      } else if (field === "type") {
        newData.category = ""
        newData.subCategory = ""
      } else if (field === "category") {
        newData.subCategory = ""
      }

      return newData
    })

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.domain) newErrors.domain = "Domain is required"
    if (!formData.type) newErrors.type = "Type is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.subCategory) newErrors.subCategory = "Sub-category is required"
    if (!formData.brand.trim()) newErrors.brand = "Brand is required"
    if (!formData.model.trim()) newErrors.model = "Model is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!formData.subCategory) {
      // Show user error
      alert("Please select a sub-category")
      return;
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Failed to save equipment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {equipment ? "Edit Equipment" : "Add New Equipment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter equipment name"
                className={errors.name ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Equipment["status"]) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Domain */}
            <div className="space-y-2">
              <Label htmlFor="domain">Domain *</Label>
              <Select value={formData.domain} onValueChange={(value) => handleInputChange("domain", value)}>
                <SelectTrigger className={errors.domain ? "border-red-500 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.domain && <p className="text-sm text-red-600">{errors.domain}</p>}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
                disabled={!formData.domain}
              >
                <SelectTrigger className={errors.type ? "border-red-500 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={!formData.type}
              >
                <SelectTrigger className={errors.category ? "border-red-500 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Sub-Category */}
            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub-Category *</Label>
              <Select
                value={formData.subCategory}
                onValueChange={(value) => handleInputChange("subCategory", value)}
                disabled={!formData.category || subCategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={subCategories.length === 0 ? "Aucune sous-catégorie" : "Select sub-category"} />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {subCategories.length === 0 && (
                <p className="text-sm text-gray-500">Aucune sous-catégorie disponible pour cette catégorie.</p>
              )}
              {errors.subCategory && <p className="text-sm text-red-600">{errors.subCategory}</p>}
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="Enter brand name"
                className={errors.brand ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.brand && <p className="text-sm text-red-600">{errors.brand}</p>}
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="Enter model name"
                className={errors.model ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[100px]">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : equipment ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
