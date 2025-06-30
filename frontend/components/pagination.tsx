// 📁 Fichier: frontend/components/ui/pagination.tsx
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"


interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null
  
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Précédent
        </Button>
        
        <span className="text-sm text-gray-600 px-4">
          Page {currentPage} sur {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="text-sm text-gray-600">
        {totalPages > 0 && (
          <span>
            {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} / {totalItems}
          </span>
        )}
      </div>
    </div>
  )
}