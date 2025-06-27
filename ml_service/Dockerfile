# Step 1: light image with Python
FROM python:3.10-slim

# Step 2: avoid unnecessary interactions
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TRANSFORMERS_CACHE=/app/.cache/huggingface

# Step 3: install the useful system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Step 4: define the working directory
WORKDIR /app

# Step 5: copy the requirements file
COPY requirements.txt .

# Step 6: install the Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Step 7: copy the code
COPY . .

# Step 8: expose the port for FastAPI 
EXPOSE 8000

# Step 9: start the Uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]