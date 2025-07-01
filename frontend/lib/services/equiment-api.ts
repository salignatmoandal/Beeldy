import { EquipmentSchema, CreateEquipmentSchema, UpdateEquipmentSchema } from "@/lib/schemas/equipment"
import type { Equipment, CreateEquipment, UpdateEquipment } from "@/lib/schemas/equipment"

// URL of the backend Go (port 3000 as configured in main.go)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

class EquipmentAPIError extends Error {
  constructor(
    message: string,
    public status?: number, 
    public data?: any
  ) {
    super(message)
    this.name = "EquipmentAPIError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new EquipmentAPIError(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    )
  }
  
  return response.json()
}

export interface PaginationParams {
  page: number
  pageSize: number
  search?: string
  domain?: string
  type?: string
  category?: string
  subCategory?: string
  status?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export class EquipmentAPI {
  // Get all equipments
  static async getAllEquipments(): Promise<Equipment[]> {
    const response = await fetch(`${API_BASE_URL}/equipments`)
    const data = await handleResponse<Equipment[]>(response)
    
    // Validation with Zod
    return data.map(equipment => EquipmentSchema.parse(equipment))
  }
  
  // Get an equipment by ID
  static async getEquipmentById(id: string): Promise<Equipment> {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`)
    const data = await handleResponse<Equipment>(response)
    
    return EquipmentSchema.parse(data)
  }
  
  // Create an equipment
  static async createEquipment(equipmentData: CreateEquipment): Promise<Equipment> {
    // Validation avant envoi
    const validatedData = CreateEquipmentSchema.parse(equipmentData)
    
    const response = await fetch(`${API_BASE_URL}/equipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    })
    
    const data = await handleResponse<Equipment>(response)
    return EquipmentSchema.parse(data)
  }
  
  // Update an equipment
  static async updateEquipment(id: string, equipmentData: UpdateEquipment): Promise<Equipment> {
    // Validation avant envoi
    const validatedData = UpdateEquipmentSchema.parse(equipmentData)
    
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    })
    
    const data = await handleResponse<Equipment>(response)
    return EquipmentSchema.parse(data)
  }
  
  // Delete an equipment
  static async deleteEquipment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
      method: "DELETE",
    })
    
    await handleResponse(response)
  }
  
  // Delete multiple equipments 
  static async deleteEquipments(ids: string[]): Promise<void> {
    // For the moment, we delete one by one
    await Promise.all(ids.map(id => this.deleteEquipment(id)))
  }
  

  // Enrich an equipment
  static async enrichEquipment(name: string, topK: number = 3): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/equipments/enrich`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, top_k: topK }),
    });
    if (!response.ok) throw new Error("Erreur enrichissement");
    return response.json();
  }

  // Get equipments paginated
  static async getEquipmentsPaginated(params: PaginationParams): Promise<PaginatedResponse<Equipment>> {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.domain && { domain: params.domain }),
      ...(params.type && { type: params.type }),
      ...(params.category && { category: params.category }),
      ...(params.subCategory && { sub_category: params.subCategory }),
      ...(params.status && { status: params.status }),
    })
    
    const response = await fetch(`${API_BASE_URL}/equipments/paginated?${searchParams}`)
    const data = await handleResponse<PaginatedResponse<Equipment>>(response)
    
    return {
      data: data.data.map(equipment => EquipmentSchema.parse(equipment)),
      pagination: data.pagination
    }
  }
}