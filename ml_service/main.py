from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import logging
from enricher import get_enricher, enrich_equipment_name

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Microservice IA",
    description="Service IA for equipment enrichment",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EnrichRequest(BaseModel):
    input: str
    top_k: Optional[int] = 3

class EnrichResponse(BaseModel):
    input: str
    results: List[Dict]
    total_found: int

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

@app.on_event("startup")
async def startup_event():
    """Initialize the system at startup"""
    logger.info("Starting the IA microservice...")
    try:
        # Initialize the enrichier at startup
        get_enricher()
        logger.info("IA microservice started successfully")
    except Exception as e:
        logger.error(f"Error starting the IA microservice: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "IA microservice",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        enricher = get_enricher()
        stats = enricher.get_statistics()
        return {
            "status": "healthy",
            "statistics": stats
        }
    except Exception as e:
        logger.error(f"Health check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enrich", response_model=EnrichResponse)
async def enrich(req: EnrichRequest):
    """
    Main enrichment endpoint
    
    Args:
        req: Request containing the equipment name to enrich
        
    Returns:
        Enrichment results with the found matches
    """
    try:
        logger.info(f"Enrichment request received: {req.input}")
        
        if not req.input or req.input.strip() == "":
            raise HTTPException(
                status_code=400, 
                detail="The equipment name cannot be empty"
            )
        
        result = enrich_equipment_name(req.input, req.top_k)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        logger.info(f"Enrichment successful: {result['total_found']} results found")
        return EnrichResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during enrichment: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.get("/statistics")
async def get_statistics():
    """Retrieve the system statistics"""
    try:
        enricher = get_enricher()
        return enricher.get_statistics()
    except Exception as e:
        logger.error(f"Error retrieving the statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/equipment/{equipment_id}")
async def get_equipment_by_id(equipment_id: int):
    """Retrieve an equipment by its ID"""
    try:
        enricher = get_enricher()
        if equipment_id < 0 or equipment_id >= len(enricher.df):
            raise HTTPException(status_code=404, detail="Equipment not found")
        
        equipment = enricher.df.iloc[equipment_id]
        return {
            "id": equipment_id,
            "domain": equipment["domain"],
            "type": equipment["type"],
            "category": equipment["category"],
            "sub_category": equipment["sub_category"],
            "name": equipment["name"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving the equipment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)