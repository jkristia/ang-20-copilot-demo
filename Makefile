.PHONY: help server client install install-shared install-server install-client generate-data

.DEFAULT_GOAL := help

help: ## Show available commands
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-15s %s\n", $$1, $$2}'
	@echo ""

install: install-shared install-server install-client ## Install dependencies for both server and client

install-shared:
	@cd shared && npm install && npm run build

install-server:
	@cd server && npm install

install-client:
	@cd client && npm install

# Mock data files - add new entries here as needed
DATA_DIR := server/data
MOCK_EMPLOYEES := $(DATA_DIR)/employees.csv

# Ensure mock data exists (runs before server)
ensure-data: $(MOCK_EMPLOYEES)

$(MOCK_EMPLOYEES):
	@echo "Generating employees.csv..."
	@python3 scripts/generate_employees.py

server: ensure-data ## Start the NestJS backend server
	cd server && npm run start:dev

client: ## Start the Angular frontend client
	cd client && npm start

generate-data: ## Regenerate all mock data (forces regeneration)
	@rm -f $(MOCK_EMPLOYEES)
	@$(MAKE) ensure-data
