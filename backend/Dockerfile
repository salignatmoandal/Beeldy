FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copie du code source
COPY . .


RUN go build -o app ./cmd

# Step 2 : light image
FROM alpine:latest

WORKDIR /app

# copy the binary from the builder image
COPY --from=builder /app/app .

# expose the port
EXPOSE 3000

# launch the app
CMD ["./app"]