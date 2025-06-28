"use client"

import type React from "react"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Equipment } from "@/types/equipment"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

interface EquipmentTableProps {
  equipments: Equipment[]
  loading: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onEdit: (equipment: Equipment) => void
  onDelete: (id: string) => void
}

type SortField = keyof Equipment
type SortDirection = "asc" | "desc"

export function EquipmentTable({
  equipments,
  loading,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
}: EquipmentTableProps) {
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedEquipments = [...equipments].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(equipments.map((eq) => eq.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  const getStatusBadgeVariant = (status: Equipment["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "maintenance":
        return "secondary"
      case "inactive":
        return "destructive"
      default:
        return "outline"
    }
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
      >
        {children}
        {sortField === field &&
          (sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
      </Button>
    </TableHead>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-100">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === equipments.length && equipments.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all equipments"
              />
            </TableHead>
            <SortableHeader field="name">Name</SortableHeader>
            <SortableHeader field="domain">Domain</SortableHeader>
            <SortableHeader field="type">Type</SortableHeader>
            <SortableHeader field="category">Category</SortableHeader>
            <SortableHeader field="subCategory">Sub-Category</SortableHeader>
            <SortableHeader field="brand">Brand</SortableHeader>
            <SortableHeader field="model">Model</SortableHeader>
            <SortableHeader field="status">Status</SortableHeader>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEquipments.map((equipment) => (
            <TableRow key={equipment.id} className="border-gray-50 hover:bg-gray-50/50">
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(equipment.id)}
                  onCheckedChange={(checked) => handleSelectOne(equipment.id, checked as boolean)}
                  aria-label={`Select ${equipment.name}`}
                />
              </TableCell>
              <TableCell className="font-medium text-gray-900">{equipment.name}</TableCell>
              <TableCell className="text-gray-600">{equipment.domain}</TableCell>
              <TableCell className="text-gray-600">{equipment.type}</TableCell>
              <TableCell className="text-gray-600">{equipment.category}</TableCell>
              <TableCell className="text-gray-600">{equipment.subCategory}</TableCell>
              <TableCell className="text-gray-600">{equipment.brand}</TableCell>
              <TableCell className="text-gray-600">{equipment.model}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(equipment.status)} className="capitalize">
                  {equipment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onEdit(equipment)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(equipment.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {equipments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No equipments found</p>
          <p className="text-sm">Try adjusting your filters or add a new equipment</p>
        </div>
      )}
    </div>
  )
}
