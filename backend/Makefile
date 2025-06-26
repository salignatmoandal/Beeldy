# Colors
GREEN=\033[0;32m
RED=\033[0;31m
YELLOW=\033[1;33m
NC=\033[0m

.PHONY: help all lint fmt vet sec vuln docker-build trivy clean install-tools

help:
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@echo "  $(GREEN)help         $(NC) Show this help message"
	@echo "  $(GREEN)all          $(NC) Run all checks (lint, fmt, vet, sec, vuln, docker-build, trivy)"
	@echo "  $(GREEN)lint         $(NC) Lint the code with golangci-lint"
	@echo "  $(GREEN)fmt          $(NC) Format the code with go fmt"
	@echo "  $(GREEN)vet          $(NC) Static analysis with go vet"
	@echo "  $(GREEN)sec          $(NC) Security analysis with gosec"
	@echo "  $(GREEN)vuln         $(NC) Vulnerability scan with govulncheck"
	@echo "  $(GREEN)docker-build $(NC) Build the Docker image"
	@echo "  $(GREEN)trivy        $(NC) Scan the Docker image with Trivy"
	@echo "  $(GREEN)clean        $(NC) Remove the local Docker image"
	@echo "  $(GREEN)install-tools$(NC) Install all required tools (linters, scanners, etc.)"
	@echo ""

all: lint fmt vet sec vuln docker-build trivy

lint:
	@echo "$(YELLOW)==> Linting with golangci-lint...$(NC)"
	@golangci-lint run || (echo "$(RED)✗ Lint failed$(NC)"; exit 1)
	@echo "$(GREEN)✓ Lint OK$(NC)"

fmt:
	@echo "$(YELLOW)==> Formatting code...$(NC)"
	@go fmt ./...
	@echo "$(GREEN)✓ Format OK$(NC)"

vet:
	@echo "$(YELLOW)==> Static analysis (go vet)...$(NC)"
	@go vet ./... || (echo "$(RED)✗ Vet failed$(NC)"; exit 1)
	@echo "$(GREEN)✓ Vet OK$(NC)"

sec:
	@echo "$(YELLOW)==> Security analysis (gosec)...$(NC)"
	@go install github.com/securego/gosec/v2/cmd/gosec@latest
	@gosec ./... || (echo "$(RED)✗ Gosec failed$(NC)"; exit 1)
	@echo "$(GREEN)✓ Gosec OK$(NC)"

vuln:
	@echo "$(YELLOW)==> Vulnerability scan (govulncheck)...$(NC)"
	@go install golang.org/x/vuln/cmd/govulncheck@latest
	@govulncheck ./... || (echo "$(RED)✗ Vulnerabilities found$(NC)"; exit 1)
	@echo "$(GREEN)✓ No known vulnerabilities$(NC)"

docker-build:
	@echo "$(YELLOW)==> Building Docker image...$(NC)"
	@docker build -t terralambda .
	@echo "$(GREEN)✓ Docker build OK$(NC)"

trivy:
	@echo "$(YELLOW)==> Scanning Docker image with Trivy...$(NC)"
	@docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image terralambda || (echo "$(RED)✗ Docker vulnerabilities$(NC)"; exit 1)
	@echo "$(GREEN)✓ Trivy OK$(NC)"

clean:
	@echo "$(YELLOW)==> Cleaning up...$(NC)"
	@docker rmi terralambda || true
	@echo "$(GREEN)✓ Clean OK$(NC)"

install-tools:
	@echo "$(YELLOW)==> Installing required tools...$(NC)"
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@go install github.com/securego/gosec/v2/cmd/gosec@latest
	@go install golang.org/x/vuln/cmd/govulncheck@latest
	@echo "$(GREEN)✓ Tools installed$(NC)"