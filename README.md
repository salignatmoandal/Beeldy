# Beeldi Test – Microservices Architecture

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

# Fonctionnalités principales 
Fonctionnalités principales
Filtres avancés (domaine, type, catégorie…)
Pagination et recherche textuelle
Création, édition, suppression d’équipements
Enrichissement IA (suggestions intelligentes)
Backend optimisé pour les gros volumes de données

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

#  Backend Folder Structure
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

# Docker 
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
pnpm dev
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

# Swagger UI - EndPoint MicroService ML|AI

```
http://127.0.0.1:8000/docs
```

# CURL FORMATTER


```curl http://localhost:3000/api/equipments | jq```

## Create Equipement (POST/api/equipements)

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

## Get All Equipments  (GET/api/equipments)

```curl http://localhost:3000/api/equipments```

## Get Equipment by ID(GET/api/equipments:id)
```curl http://localhost:3000/api/equipments/587dcdb6-c083-423a-abc9-c6cb3a4473cb```

## Update equipment (PATCH/api/equiments/:id)

```curl -X PATCH http://localhost:3000/api/equipments/587dcdb6-c083-423a-abc9-c6cb3a4473cb \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance",
    "model": "Z1200-PRO",
    "type" : "Escalier"
  }'
```

# Delete Equipments
```
curl -X DELETE http://localhost:3000/api/equipments/587dcdb6-c083-423a-abc9-c6cb3a4473cb
```


# Example AI Enrichment Request 


```curl -X POST http://localhost:3000/api/equipments/enrich \
  -H "Content-Type: application/json" \
  -d '{"name": "Ascenseur LX-Panorama", "top_k": 5}'
```

# PostgreSQL Optimization

```CREATE INDEX CONCURRENTLY idx_equipment_created_at ON equipments(created_at DESC);
CREATE INDEX CONCURRENTLY idx_equipment_domain ON equipments(domain);
CREATE INDEX CONCURRENTLY idx_equipment_type ON equipments(type);
CREATE INDEX CONCURRENTLY idx_equipment_category ON equipments(category);
CREATE INDEX CONCURRENTLY idx_equipment_status ON equipments(status);

```
#  How to evaluate the Performance of the Backend 
```
ab -n 2000 -c 20 "http://localhost:3000/api/equipments/paginated?page=1&pageSize=50" | jq
```
# Frontend Performance 
```
http://localhost:3000/api/equipments/paginated?page=2&pageSize=50
```
