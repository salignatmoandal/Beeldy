import { useState, useCallback, useEffect } from "react"
import { EquipmentAPI, PaginationParams } from "@/lib/services/equiment-api"
import type { Equipment, CreateEquipment, UpdateEquipment } from "@/lib/schemas/equipment"

export function useEquipmentsPaginated() {
  // Pagination
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({
    search: "",
    domain: "",
    type: "",
    category: "",
    subCategory: "",
    status: ""
  })

  // Sélection
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const clearSelection = () => setSelectedIds([])
  const [hierarchy, setHierarchy] = useState<any>(null)

  // CRUD
  const createEquipment = useCallback(async (equipmentData: CreateEquipment) => {
    setLoading(true)
    setError(null)
    try {
      const newEquipment = await EquipmentAPI.createEquipment(equipmentData)
      // Optionnel : recharger la page courante
      await loadEquipments(pagination.page)
      return newEquipment
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création")
      throw err
    } finally {
      setLoading(false)
    }
  }, [pagination.page])

  const updateEquipment = useCallback(async (id: string, equipmentData: UpdateEquipment) => {
    setLoading(true)
    setError(null)
    try {
      const updatedEquipment = await EquipmentAPI.updateEquipment(id, equipmentData)
      await loadEquipments(pagination.page)
      return updatedEquipment
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour")
      throw err
    } finally {
      setLoading(false)
    }
  }, [pagination.page])

  const deleteEquipment = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await EquipmentAPI.deleteEquipment(id)
      await loadEquipments(pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression")
      throw err
    } finally {
      setLoading(false)
    }
  }, [pagination.page])

  const deleteEquipments = useCallback(async (ids: string[]) => {
    setLoading(true)
    setError(null)
    try {
      await EquipmentAPI.deleteEquipments(ids)
      await loadEquipments(pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression multiple")
      throw err
    } finally {
      setLoading(false)
    }
  }, [pagination.page])

  // Pagination
  const loadEquipments = useCallback(async (page: number = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params: PaginationParams = {
        page,
        pageSize: pagination.pageSize,
        ...filters
      }
      const response = await EquipmentAPI.getEquipmentsPaginated(params)
      setEquipments(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [pagination.pageSize, filters])

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadEquipments(page)
    }
  }, [pagination.totalPages, loadEquipments])

  useEffect(() => {
    loadEquipments()
  }, [loadEquipments])

  return {
    equipments,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    goToPage,
    
    createEquipment,
    updateEquipment,
    deleteEquipment,
    deleteEquipments,
    selectedIds,
    setSelectedIds,
    clearSelection,
    hierarchy,
    setHierarchy,
  }
}