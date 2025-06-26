import pandas as pd
import numpy as np
import faiss
import logging
from sentence_transformers import SentenceTransformer
from typing import Dict, List, Optional
import os

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EquipmentEnricher:
    def __init__(self, csv_path: str = "data/equipments.csv"):
        """
        Initialize the equipment enrichier with CSV loading,
        vectorization and FAISS indexing
        """
        self.csv_path = csv_path
        self.model = None
        self.index = None
        self.df = None
        self.corpus_embeddings = None
        
        logger.info("Initializing the equipment enrichier...")
        self._load_data()
        self._initialize_model()
        self._create_embeddings()
        self._build_index()
        logger.info("Equipment enrichier initialized successfully")
    
    def _load_data(self):
        """Load and preprocess the CSV data"""
        try:
            self.df = pd.read_csv(self.csv_path)
            self.df.columns = ["domain", "type", "category", "sub_category"]
            self.df.fillna("", inplace=True)
            
            # Create the name field combining type, category and sub-category
            self.df["name"] = (
                self.df[["type", "category", "sub_category"]]
                .agg(" ".join, axis=1)
                .str.replace("  ", " ")
                .str.strip()
            )
            
            # Filtrage des lignes vides
            self.df = self.df[self.df["name"].str.len() > 0]
            
            logger.info(f"Data loaded: {len(self.df)} equipments")
            
        except Exception as e:
            logger.error(f"Error loading the data: {e}")
            raise
    
    def _initialize_model(self):
        """Initialize the SentenceTransformer model"""
        try:
            logger.info("Loading the SentenceTransformer model...")
            self.model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading the model: {e}")
            raise
    
    def _create_embeddings(self):
        """Create the embeddings for the corpus"""
        try:
            logger.info("Creating the embeddings...")
            self.corpus_embeddings = self.model.encode(
                self.df["name"].tolist(), 
                convert_to_numpy=True,
                show_progress_bar=True
            )
            logger.info(f"Embeddings created: {self.corpus_embeddings.shape}")
        except Exception as e:
            logger.error(f"Error creating the embeddings: {e}")
            raise
    
    def _build_index(self):
        """Build the FAISS index"""
        try:
            logger.info("Building the FAISS index...")
            dimension = self.corpus_embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
            self.index.add(self.corpus_embeddings)
            logger.info(f"FAISS index built with {self.index.ntotal} vectors")
        except Exception as e:
            logger.error(f"Error building the index: {e}")
            raise
    
    def enrich_equipment_name(self, name: str, top_k: int = 3) -> Dict:
        """
        Enrich an equipment name by finding the closest matches
        
        Args:
            name: Equipment name to enrich
            top_k: Number of results to return
            
        Returns:
            Dictionary containing the enrichment results
        """
        try:
            if not name or name.strip() == "":
                return {"error": "Empty equipment name"}
            
            # Vectorization of the query
            query_embedding = self.model.encode([name.strip()], convert_to_numpy=True)
            
            # Recherche dans l'index FAISS
            distances, indices = self.index.search(query_embedding, k=top_k)
            
            # Préparation des résultats
            results = []
            for i in range(len(indices[0])):
                idx = indices[0][i]
                distance = distances[0][i]
                
                if idx < len(self.df):
                    equipment = self.df.iloc[idx]
                    results.append({
                        "domain": equipment["domain"],
                        "type": equipment["type"],
                        "category": equipment["category"],
                        "sub_category": equipment["sub_category"],
                        "name": equipment["name"],
                        "similarity_score": float(1 / (1 + distance)),  # Conversion en score de similarité
                        "distance": float(distance)
                    })
            
            return {
                "input": name,
                "results": results,
                "total_found": len(results)
            }
            
        except Exception as e:
            logger.error(f"Error during enrichment: {e}")
            return {"error": f"Error during enrichment: {str(e)}"}
    
    def get_statistics(self) -> Dict:
        """Retrieve the statistics of the enrichment system"""
        return {
            "total_equipments": len(self.df),
            "index_size": self.index.ntotal if self.index else 0,
            "embedding_dimension": self.corpus_embeddings.shape[1] if self.corpus_embeddings is not None else 0,
            "model_name": "all-MiniLM-L6-v2"
        }

# Instance globale pour éviter de recharger le modèle à chaque requête
enricher = None

def get_enricher() -> EquipmentEnricher:
    """Return the global instance of the enrichier"""
    global enricher
    if enricher is None:
        enricher = EquipmentEnricher()
    return enricher

def enrich_equipment_name(name: str, top_k: int = 3) -> Dict:
    """Wrapper function for the enrichment"""
    enricher = get_enricher()
    return enricher.enrich_equipment_name(name, top_k)

if __name__ == "__main__":
    # Test du système
    enricher = EquipmentEnricher()
    
    # Tests avec différents types d'équipements
    test_cases = [
        "Chaudière gaz THX 2000",
        "Climatiseur mobile",
        "Radiateur électrique",
        "Ventilo-convecteur",
        "Groupe électrogène"
    ]
    
    for test_case in test_cases:
        print(f"\n=== Test: {test_case} ===")
        result = enricher.enrich_equipment_name(test_case)
        print(result)