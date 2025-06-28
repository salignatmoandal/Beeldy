"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EquipmentFilters, EquipmentHierarchy } from "@/types/equipment"

interface EquipmentFiltersProps {
  filters: EquipmentFilters
  onFiltersChange: (filters: EquipmentFilters) => void
  hierarchy: EquipmentHierarchy
  totalCount: number
  filteredCount: number
}

export function EquipmentFiltersComponent({
  filters,
  onFiltersChange,
  hierarchy,
  totalCount,
  filteredCount,
}: EquipmentFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  const domains = Object.keys(hierarchy.domains)
  const types = filters.domain ? Object.keys(hierarchy.domains[filters.domain]?.types || {}) : []
  const categories =
    filters.domain && filters.type
      ? Object.keys(hierarchy.domains[filters.domain]?.types[filters.type]?.categories || {})
      : []
  const subCategories =
    filters.domain && filters.type && filters.category
      ? hierarchy.domains[filters.domain]?.types[filters.type]?.categories[filters.category]?.subCategories || []
      : []

  const handleFilterChange = (key: keyof EquipmentFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }

    // Reset dependent filters when parent changes
    if (key === "domain") {
      newFilters.type = ""
      newFilters.category = ""
      newFilters.subCategory = ""
    } else if (key === "type") {
      newFilters.category = ""
      newFilters.subCategory = ""
    } else if (key === "category") {
      newFilters.subCategory = ""
    }

    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    setSearchValue("")
    onFiltersChange({
      search: "",
      domain: "",
      type: "",
      category: "",
      subCategory: "",
    })
  }

  const hasActiveFilters = filters.search || filters.domain || filters.type || filters.category || filters.subCategory

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 h-8 px-3"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search equipments..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>

        {/* Domain Filter */}
        <Select value={filters.domain} onValueChange={(value: string) => handleFilterChange("domain", value)}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="All Domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-domains">All Domains</SelectItem>
            {domains.map((domain) => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={filters.type}
          onValueChange={(value: string) => handleFilterChange("type", value)}
          disabled={!filters.domain}
        >
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={(value: string) => handleFilterChange("category", value)}
          disabled={!filters.type}
        >
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sub-Category Filter */}
        <Select
          value={filters.subCategory}
          onValueChange={(value: string) => handleFilterChange("subCategory", value)}
          disabled={!filters.category}
        >
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="All Sub-Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-sub-categories">All Sub-Categories</SelectItem>
            {subCategories.map((subCategory: any) => (
              <SelectItem key={subCategory} value={subCategory}>
                {subCategory}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredCount} of {totalCount} equipments
      </div>
    </div>
  )
}
