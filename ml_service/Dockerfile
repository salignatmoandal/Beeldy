# Étape 1 : base image légère avec Python
FROM python:3.10-slim

# Étape 2 : éviter les interactions inutiles
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TRANSFORMERS_CACHE=/app/.cache/huggingface

# Étape 3 : installer les dépendances système utiles
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Étape 4 : définir le dossier de travail
WORKDIR /app

# Étape 5 : copier les fichiers requirements (si tu utilises poetry, adapte ici)
COPY requirements.txt .

# Étape 6 : installer les dépendances Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Étape 7 : copier le code
COPY . .

# Étape 8 : exposer le port pour FastAPI (optionnel)
EXPOSE 8000

# Étape 9 : démarrer le serveur Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]