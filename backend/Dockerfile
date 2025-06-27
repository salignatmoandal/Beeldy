
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copie des fichiers go mod et sum
COPY go.mod go.sum ./
RUN go mod download

# Copie du code source
COPY . .


RUN go build -o app ./cmd

# Étape 2 : image finale, plus légère
FROM alpine:latest

WORKDIR /app

# Copie du binaire depuis l'étape de build
COPY --from=builder /app/app .

# Port à exposer
EXPOSE 3000

# Commande de lancement
CMD ["./app"]