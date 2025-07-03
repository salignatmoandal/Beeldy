# Beeldi Test – Equipment Management 

This project is a modern microservices architecture for equipment management and enrichment, built with:

- Go (Golang): Main backend API (REST, Gin, GORM, PostgreSQL)
- Python (FastAPI): AI/ML microservice for equipment enrichment (NLP, FAISS, Sentence Transformers)
- PostgreSQL: Relational database for persistent storage
- Docker Compose: Unified orchestration for local development

| Composant      | Stack                                          |
| -------------- | ---------------------------------------------- |
| API principale | Go + Gin + Gorm + PostgreSQL                   |
| IA enrichie    | Python + FastAPI + FAISS + SentenceTransformer |
| Frontend       | Next.js + ShadCN + Zustand                     |
| Orchestration  | Docker + docker-compose                        |
| CI/CD          | GitHub Actions (lint, test, Trivy, build)      |
| Stockage       | PostgreSQL (indexé + scalable)                 |
| Format data    | JSON + CSV                                     |

# Core feature

- Advanced Filters
  Filter equipments by domain, type, category, and more using dynamic dropdowns.
- Full-Text Search & Pagination
  Quickly search equipment by name or description with server-side pagination for performance.
- CRUD Operations
Create, read, update, and delete equipment records with validation and user-friendly modals.
- AI-Powered Enrichment
Smart suggestions (e.g., category, type) using machine learning models based on equipment names or metadata.
- High-Performance Backend
Optimized for large datasets with PostgreSQL indexing, Redis caching, and scalable architecture.


# Architecture Diagram 
```
+-------------------+         +-------------------+         +-------------------+
|                   |  REST   |                   |  HTTP   |                   |
|   Frontend Tool   +-------->+   Go Backend API  +-------->+   Python ML/AI    |
| (Bruno, cURL, etc)|         |   (Gin, GORM)     |         |   (FastAPI, NLP)  |
+-------------------+         +-------------------+         +-------------------+
                                   |   ^
                                   |   |
                                   v   |
                             +-------------------+
                             |   PostgreSQL DB   |
                             +-------------------+
```


      
The Go backend exposes REST endpoints for equipment CRUD and enrichment.
The Python service exposes an /enrich endpoint for AI-powered enrichment.
The backend communicates with the ML service via HTTP and with PostgreSQL for data persistence.
All services are orchestrated with Docker Compose.

#  Backend Architecture
```
.
├── backend/           # Go backend API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   ├── Dockerfile
│   └── ...
├── ml_service/        # Python FastAPI ML microservice
│   ├── main.py
│   ├── enricher.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
└── .env               # Environment variables for DB and services
```
# Frontend Architecture 
```

app/
├── layout.tsx              # Layout principal (header, theme, etc.)
├── page.tsx                # Page principale avec affichage des équipements
├── globals.css             # Styles globaux (import Tailwind, custom CSS)

components/
├── equipment-table.tsx     # Table d'affichage des équipements
├── equipment-form-modal.tsx# Modal de création/édition d’équipement
├── equipment-filter.tsx    # Filtres de recherche par domaine, type, etc.
├── search-input.tsx        # Barre de recherche
├── pagination.tsx          # Pagination
├── delete-confirmation-dialog.tsx # Confirmation de suppression
└── ui/                     # Composants UI partagés (depuis ShadCN ou custom)
    ├── button.tsx, input.tsx, dialog.tsx, etc.

hook/
├── use-equipments.ts       # Hook pour récupérer tous les équipements
└── use-equipments-paginated.ts # Hook pour la pagination avec filtre/recherche

lib/
├── schemas/equipment.ts    # Zod schemas pour valider les données
├── services/equipment-api.ts # Fonctions d’appel à l’API (GET, POST, etc.)
├── stores/equipment-store.ts # Store Zustand pour l’état local des équipements
└── utils.ts                # Fonctions utilitaires

types/
└── equipment.ts            # Types TypeScript liés aux équipements

```

# Running Locally 

```
docker-compose up --build
```

## Run backend independently

```
cd Backend
go run cmd/main.go
```
## Run the frontend
```
cd Frontend
pnpm install
pnpm run dev
```

# Main API Endpoints

| Method | Endpoint                    | Description                             |
| ------ | --------------------------- | --------------------------------------- |
| GET    | `/api/equipments`           | Legacy – get all equipment (unfiltered) |
| GET    | `/api/equipments/paginated` | Paginated, filtered equipment list      |
| POST   | `/api/equipments`           | Create new equipment                    |
| PATCH  | `/api/equipments/:id`       | Update equipment                        |
| DELETE | `/api/equipments/:id`       | Delete equipment                        |
| POST   | `/api/equipments/enrich`    | Call AI service to enrich metadata      |

# Swagger UI - AI Enrichment Microservice (Python)
_Access OpenAPI Docs :_
```
http://127.0.0.1:8000/docs
```

# Example  Enrichment Request 

```curl -X POST http://localhost:3000/api/equipments/enrich \
  -H "Content-Type: application/json" \
  -d '{"name": "Ascenseur LX-Panorama", "top_k": 5}'
```

# Sample cURL usage 

```
curl http://localhost:3000/api/equipments | jq
```

### Create Equipement (POST/api/equipements)

```
curl -X POST http://localhost:3000/api/equipments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ascenseur Z1000",
    "brand": "Thyssenkrupp",
    "model": "Z1000",
    "status": "active",
    "domain": "LEVAGE",
    "type": "Ascenseur",
    "category": "Électrique",
    "sub_category": "Traction"
  }'
```

### Get All Equipments  (GET/api/equipments)

```
curl http://localhost:3000/api/equipments
```

### Get Equipment by ID(GET/api/equipments:id)
```
curl http://localhost:3000/api/equipments/587dcdb6-c083-423a-abc9-c6cb3a4473cb
```

### Update equipment (PATCH/api/equiments/:id)

```curl -X PATCH http://localhost:3000/api/equipments/587dcdb6-c083-423a-abc9-c6cb3a4473cb \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance",
    "model": "Z1200-PRO",
    "type" : "Escalier"
  }'
```

### Delete Equipments
```
curl -X DELETE http://localhost:3000/api/equipments/587dcdb6-c083-423a-abc9-c6cb3a4473cb
```




# Backend Performance & Optimization with Large Datasets 

The application is designed to efficiently handle large volumes of data (100,000+ equipments) thanks to several optimizations:

- **Database Indexing:** All relevant columns are indexed in PostgreSQL, ensuring fast filtering and searching even with large tables.
- **API Pagination:** The backend API returns paginated results, so only a small subset of data is loaded at a time.
- **Optimized Queries:** All queries are written to leverage indexes and avoid unnecessary full table scans.
- **Scalability:** The architecture allows for horizontal scaling of both the backend and the database.

## PostgreSQL Indexing

```CREATE INDEX CONCURRENTLY idx_equipment_created_at ON equipments(created_at DESC);
CREATE INDEX CONCURRENTLY idx_equipment_domain ON equipments(domain);
CREATE INDEX CONCURRENTLY idx_equipment_type ON equipments(type);
CREATE INDEX CONCURRENTLY idx_equipment_category ON equipments(category);
CREATE INDEX CONCURRENTLY idx_equipment_status ON equipments(status);

```
### How to evaluate the Performance of the Backend 
**Benchmark with ApacheBench**
```
ab -n 2000 -c 20 "http://localhost:3000/api/equipments/paginated?page=1&pageSize=50" | jq
```
# Frontend Performance 
```
http://localhost:3000/api/equipments/paginated?page=2&pageSize=50
```
# FrontEnd - Improvements
- Lazy Loading & Code Splitting


# Backend & ML Microservice – Improvements 
## Backend (Go) – Optimizations
- Add Redis Caching (to reduce response times and avoid unnecssary database or ML service calls)
- Asynchronous Processing via Queue (To avoid blocking the API during long-running tasks like ML inference)
- gRPC architecture (High performance, binary protocol, faster than JSON/REST + Strong typing with `.proto`

## ML Resut Caching 
- Inter-service communication (gRPC) 
- ML result caching (using Redis in order to store recent analysis result with TTL, supports parallel processing via multiple worker or containers) 
