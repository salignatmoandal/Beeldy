import { EquipmentSchema, CreateEquipmentSchema, UpdateEquipmentSchema } from "@/lib/schemas/equipment"
import type { Equipment, CreateEquipment, UpdateEquipment } from "@/lib/schemas/equipment"

// URL of the backend Go (port 3000 as configured in your main.go)
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

export class EquipmentAPI {
  // Get all equipments
  static async getAllEquipments(): Promise<Equipment[]> {
    const response = await fetch(`${API_BASE_URL}/equipments`)
    const data = await handleResponse<Equipment[]>(response)
    
    // Validation avec Zod
    return data.map(equipment => EquipmentSchema.parse(equipment))
  }
  
  // Récupérer un équipement par ID
  static async getEquipmentById(id: string): Promise<Equipment> {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`)
    const data = await handleResponse<Equipment>(response)
    
    return EquipmentSchema.parse(data)
  }
  
  // Créer un équipement
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
  
  // Mettre à jour un équipement
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
  
  // Supprimer un équipement
  static async deleteEquipment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
      method: "DELETE",
    })
    
    await handleResponse(response)
  }
  
  // Supprimer plusieurs équipements (à implémenter dans votre backend Go si nécessaire)
  static async deleteEquipments(ids: string[]): Promise<void> {
    // Pour l'instant, on supprime un par un
    await Promise.all(ids.map(id => this.deleteEquipment(id)))
  }
  
  // Récupérer la hiérarchie (à implémenter dans votre backend Go si nécessaire)
  static async getHierarchy(): Promise<any> {
    // Pour l'instant, on retourne une hiérarchie vide
    // Vous pouvez implémenter cette route dans votre backend Go
    return {
      domains: {}
    }
  }

  static async enrichEquipment(name: string, topK: number = 3): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/equipments/enrich`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, top_k: topK }),
    });
    if (!response.ok) throw new Error("Erreur enrichissement");
    return response.json();
  }
}