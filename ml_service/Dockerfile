# Step 1: light image with Python
FROM python:3.11-slim

# Define the working directory
WORKDIR /app

# Install the minimal system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy the files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose the API port
EXPOSE 8001

# Start the API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]