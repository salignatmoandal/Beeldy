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
# Frontend Folder Structure 
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

