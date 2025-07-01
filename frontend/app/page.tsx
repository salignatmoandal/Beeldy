"use client"

import { useState } from "react"
import { Plus, Trash2, Moon, Sun, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEquipmentsPaginated } from "@/hook/use-equipments-paginated"
import { EquipmentFiltersComponent } from "@/components/equipment-filter"
import { EquipmentTable } from "@/components/equipment-table"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { EquipmentFormModal } from "@/components/equipment-form-modal"
import { Pagination } from "@/components/pagination"
import type { Equipment, EquipmentHierarchy } from "@/types/equipment"

export default function EquipmentDashboard() {
  const { theme, setTheme } = useTheme()
  const {
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
  } = useEquipmentsPaginated()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    type: "single" | "bulk"
    equipmentId?: string
    equipmentName?: string
  }>({
    isOpen: false,
    type: "single",
  })

  const handleAddEquipment = () => {
    setEditingEquipment(null)
    setIsFormModalOpen(true)
  }

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment)
    setIsFormModalOpen(true)
  }

  const handleFormSubmit = async (equipmentData: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingEquipment) {
        await updateEquipment(editingEquipment.id, equipmentData)
      } else {
        await createEquipment(equipmentData)
      }
      clearSelection()
      setIsFormModalOpen(false)
    } catch (error) {
      // The error is already handled in the hook
      console.error("Error during submission:", error)
    }
  }

  const handleDeleteSingle = (id: string) => {
    const equipment = equipments.find((eq) => eq.id === id)
    setDeleteDialog({
      isOpen: true,
      type: "single",
      equipmentId: id,
      equipmentName: equipment?.name,
    })
  }

  const handleDeleteBulk = () => {
    setDeleteDialog({
      isOpen: true,
      type: "bulk",
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      if (deleteDialog.type === "single" && deleteDialog.equipmentId) {
        await deleteEquipment(deleteDialog.equipmentId)
      } else if (deleteDialog.type === "bulk") {
        await deleteEquipments(selectedIds)
      }
      setDeleteDialog({ ...deleteDialog, isOpen: false })
    } catch (error) {
      // The error is already handled in the hook
      console.error("Error during deletion:", error)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">An error has occurred</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Equipment Management</h1>
                <p className="text-sm text-gray-600">Manage your inventory of technical equipments</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 p-0"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {selectedIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteBulk}
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedIds.length})
                </Button>
              )}

              <Button onClick={handleAddEquipment} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add an Equipment
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filtres */}
          <EquipmentFiltersComponent
            filters={filters}
            onFiltersChange={updateFilters}
            hierarchy={hierarchy}
            totalCount={pagination.total}
            filteredCount={equipments.length}
          />

          {/* Tableau */}
          <EquipmentTable
            equipments={equipments}
            loading={loading}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onEdit={handleEditEquipment}
            onDelete={handleDeleteSingle}
          />

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={goToPage}
          />
        </div>
      </main>

      {/* Modals */}
      <EquipmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        equipment={editingEquipment}
        hierarchy={hierarchy}
        setHierarchy={setHierarchy as React.Dispatch<React.SetStateAction<EquipmentHierarchy>>}
      />  

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title={deleteDialog.type === "single" ? "Supprimer l'Équipement" : `Supprimer ${selectedIds.length} Équipements`}
        description={
          deleteDialog.type === "single"
            ? `Are you sure you want to delete "${deleteDialog.equipmentName}" ? This action cannot be undone.`
            : `Are you sure you want to delete ${selectedIds.length} selected equipments ? This action cannot be undone.`
        }
      />
    </div>
  )
}
