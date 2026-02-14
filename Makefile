.PHONY: help server client install install-shared install-server install-client

.DEFAULT_GOAL := help

help: ## Show available commands
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-12s %s\n", $$1, $$2}'
	@echo ""

install: install-shared install-server install-client ## Install dependencies for both server and client

install-shared:
	@cd shared && npm install && npm run build

install-server:
	@cd server && npm install

install-client:
	@cd client && npm install

server: ## Start the NestJS backend server
	cd server && npm run start:dev

client: ## Start the Angular frontend client
	cd client && npm start
