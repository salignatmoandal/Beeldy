import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { EquipmentSchema, EquipmentFiltersSchema } from "@/lib/schemas/equipment"
import type { Equipment, EquipmentFilters } from "@/lib/schemas/equipment"
import type { EquipmentHierarchy } from "@/types/equipment"

interface EquipmentState {
  // État des données
  equipments: Equipment[]
  loading: boolean
  error: string | null
  
  // Filters
  filters: EquipmentFilters
  
  // Selection
  selectedIds: string[]
  
  // Hydration state
  _hasHydrated: boolean
  
  // Actions
  setEquipments: (equipments: Equipment[]) => void
  addEquipment: (equipment: Equipment) => void
  updateEquipment: (id: string, equipment: Equipment) => void
  removeEquipment: (id: string) => void
  removeEquipments: (ids: string[]) => void
  
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  setFilters: (filters: EquipmentFilters) => void
  resetFilters: () => void
  
  setSelectedIds: (ids: string[]) => void
  toggleSelection: (id: string) => void
  clearSelection: () => void
  
  // Actions of hydration
  setHasHydrated: (hasHydrated: boolean) => void
  
  // Getters calculated
  getFilteredEquipments: () => Equipment[]
  getEquipmentById: (id: string) => Equipment | undefined
  
  hierarchy: EquipmentHierarchy
  setHierarchy: (hierarchy: EquipmentHierarchy) => void
}

const initialFilters: EquipmentFilters = {
  search: "",
  domain: "",
  type: "",
  category: "",
  subCategory: "",
}

const initialHierarchy: EquipmentHierarchy = { domains: {} }

export const useEquipmentStore = create<EquipmentState>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        equipments: [],
        loading: false,
        error: null,
        filters: initialFilters,
        selectedIds: [],
        _hasHydrated: false,
        hierarchy: initialHierarchy,
        
        // Actions for equipments
        setEquipments: (equipments) => {
          // Validation with Zod
          const validatedEquipments = equipments.map(equipment => {
            try {
              return EquipmentSchema.parse(equipment)
            } catch (error) {
              console.error("Équipement invalide:", error)
              throw new Error(`Équipement invalide: ${error}`)
            }
          })
          
          set({ equipments: validatedEquipments, error: null })
        },
        
        addEquipment: (equipment) => {
          const validatedEquipment = EquipmentSchema.parse(equipment)
          set(state => ({
            equipments: [...state.equipments, validatedEquipment]
          }))
        },
        
        updateEquipment: (id, equipment) => {
          const validatedEquipment = EquipmentSchema.parse(equipment)
          set(state => ({
            equipments: state.equipments.map(eq => 
              eq.id === id ? validatedEquipment : eq
            )
          }))
        },
        
        removeEquipment: (id) => {
          set(state => ({
            equipments: state.equipments.filter(eq => eq.id !== id),
            selectedIds: state.selectedIds.filter(selectedId => selectedId !== id)
          }))
        },
        
        removeEquipments: (ids) => {
          set(state => ({
            equipments: state.equipments.filter(eq => !ids.includes(eq.id)),
            selectedIds: state.selectedIds.filter(id => !ids.includes(id))
          }))
        },
        
        // Actions for loading state
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        
        // Actions pour les filtres
        setFilters: (filters) => {
          const validatedFilters = EquipmentFiltersSchema.parse(filters)
          set({ filters: validatedFilters })
        },
        
        resetFilters: () => set({ filters: initialFilters }),
        
        // Actions for selection
        setSelectedIds: (selectedIds) => set({ selectedIds }),
        
        toggleSelection: (id) => {
          set(state => {
            const isSelected = state.selectedIds.includes(id)
            return {
              selectedIds: isSelected 
                ? state.selectedIds.filter(selectedId => selectedId !== id)
                : [...state.selectedIds, id]
            }
          })
        },
        
        clearSelection: () => set({ selectedIds: [] }),
        
        // Actions of hydration
        setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
        
        // Getters calculated
        getFilteredEquipments: () => {
          const { equipments, filters } = get()
          
          return equipments.filter(equipment => {
            if (filters.search && !equipment.name.toLowerCase().includes(filters.search.toLowerCase())) {
              return false
            }
            if (filters.domain && equipment.domain !== filters.domain) return false
            if (filters.type && equipment.type !== filters.type) return false
            if (filters.category && equipment.category !== filters.category) return false
            if (filters.subCategory && equipment.subCategory !== filters.subCategory) return false
            return true
          })
        },
        
        getEquipmentById: (id) => {
          const { equipments } = get()
          return equipments.find(eq => eq.id === id)
        },
        
        setHierarchy: (hierarchy) => set({ hierarchy: hierarchy || initialHierarchy }),
      }),
      {
        name: "equipment-store",
        partialize: (state) => ({
          equipments: state.equipments,
          filters: state.filters,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true)
        },
      }
    ),
    {
      name: "equipment-store",
    }
  )
)