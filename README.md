# Beeldi Test – Microservices Architecture

This project is a modern microservices architecture for equipment management and enrichment, built with:

- Go (Golang): Main backend API (REST, Gin, GORM, PostgreSQL)
- Python (FastAPI): AI/ML microservice for equipment enrichment (NLP, FAISS, Sentence Transformers)
- PostgreSQL: Relational database for persistent storage
- Docker Compose: Unified orchestration for local development

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

# Folder Structure
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
