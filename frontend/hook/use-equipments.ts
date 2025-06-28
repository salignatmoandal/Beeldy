import { useEffect, useCallback } from "react"
import { useEquipmentStore } from "@/lib/stores/equipment-store"
import { EquipmentAPI } from "@/lib/services/equiment-api"
import type { CreateEquipment, UpdateEquipment, EquipmentFilters } from "@/lib/schemas/equipment"

export function useEquipments() {
  const {
    equipments,
    loading,
    error,
    filters,
    selectedIds,
    setEquipments,
    addEquipment,
    updateEquipment,
    removeEquipment,
    removeEquipments,
    setLoading,
    setError,
    setFilters,
    resetFilters,
    setSelectedIds,
    toggleSelection,
    clearSelection,
    getFilteredEquipments,
    getEquipmentById,
    hierarchy,
    setHierarchy,
  } = useEquipmentStore()

  // Charger les équipements depuis votre backend Go
  const loadEquipments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await EquipmentAPI.getAllEquipments()
      setEquipments(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des équipements"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [setEquipments, setLoading, setError])

  // Créer un équipement
  const createEquipment = useCallback(async (equipmentData: CreateEquipment) => {
    try {
      setLoading(true)
      setError(null)
      const newEquipment = await EquipmentAPI.createEquipment(equipmentData)
      addEquipment(newEquipment)
      return newEquipment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [addEquipment, setLoading, setError])

  // Mettre à jour un équipement
  const updateEquipmentById = useCallback(async (id: string, equipmentData: UpdateEquipment) => {
    try {
      setLoading(true)
      setError(null)
      const updatedEquipment = await EquipmentAPI.updateEquipment(id, equipmentData)
      updateEquipment(id, updatedEquipment)
      return updatedEquipment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la mise à jour"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [updateEquipment, setLoading, setError])

  // Supprimer un équipement
  const deleteEquipment = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await EquipmentAPI.deleteEquipment(id)
      removeEquipment(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [removeEquipment, setLoading, setError])

  // Supprimer plusieurs équipements
  const deleteEquipments = useCallback(async (ids: string[]) => {
    try {
      setLoading(true)
      setError(null)
      await EquipmentAPI.deleteEquipments(ids)
      removeEquipments(ids)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression multiple"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [removeEquipments, setLoading, setError])

  // Charger les données au montage
  useEffect(() => {
    loadEquipments()
  }, [loadEquipments])

  return {
    // État
    equipments: getFilteredEquipments(),
    loading,
    error,
    filters,
    selectedIds,
    hierarchy,
    
    // Actions
    loadEquipments,
    createEquipment,
    updateEquipment: updateEquipmentById,
    deleteEquipment,
    deleteEquipments,
    
    // Filtres
    setFilters,
    resetFilters,
    
    // Sélection
    setSelectedIds,
    toggleSelection,
    clearSelection,
    
    // Utilitaires
    getEquipmentById,
    setHierarchy,
  }
}