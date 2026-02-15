.PHONY: help server client install install-shared install-server install-client generate-data kill run-all

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
MOCK_EMPLOYEE_DETAILS := $(DATA_DIR)/employee_details.csv

# Ensure mock data exists (runs before server)
ensure-data: $(MOCK_EMPLOYEES) $(MOCK_EMPLOYEE_DETAILS)

# Both files are generated together by the same script
$(MOCK_EMPLOYEES) $(MOCK_EMPLOYEE_DETAILS):
	@echo "Generating employee data..."
	@python3 scripts/generate_employees.py

server: ensure-data ## Start the NestJS backend server
	cd server && npm run start:dev

client: ## Start the Angular frontend client
	cd client && npm start

generate-data: ## Regenerate all mock data (forces regeneration)
	@rm -f $(MOCK_EMPLOYEES)
	@$(MAKE) ensure-data

kill: ## Kill server (port 3000) and client (port 4200) if running
	@-lsof -ti:3000 | xargs -r kill -9 2>/dev/null && echo "Killed server on port 3000" || true
	@-lsof -ti:4200 | xargs -r kill -9 2>/dev/null && echo "Killed client on port 4200" || true
	@-pkill -f "ng serve" 2>/dev/null && echo "Killed ng serve process" || true

run-all: ensure-data ## Start client (background) and server (foreground)
	@echo "Starting client in background..."
	@cd client && npm start > /dev/null 2>&1 &
	@sleep 2
	@echo "Starting server..."
	cd server && npm run start:dev
