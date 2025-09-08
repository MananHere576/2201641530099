# Logging Middleware

This folder contains the custom logging middleware used in both backend and frontend.

## Features
- Centralized logging for backend and frontend
- Supports levels: debug, info, warn, error, fatal
- Differentiates stack: backend / frontend
- Categorizes logs by package (e.g., handler, service, component)

## Example Log
```json
{
  "stack": "backend",
  "level": "error",
  "package": "handler",
  "message": "received string, expected bool"
}
