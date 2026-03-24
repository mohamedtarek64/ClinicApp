# Clinic Management System - ASP.NET Core 8 with AI Diagnosis

A comprehensive clinic management RESTful API built with ASP.NET Core 8 and Entity Framework Core, now integrated with a FastAPI micro-service for AI-powered disease prediction.

---

## Features

- User registration and management for Patients, Doctors, and Admins with role-based permissions.
- JWT Authentication + Refresh Tokens for secure sessions.
- AI-Powered Diagnosis: Predict probability for Diabetes, Heart Disease, and Kidney Disease using XGBoost models.
- Fast API Integration: Dedicated Python micro-service for machine learning inference.
- Docker Support: Run the entire stack (SQL Server, .NET, and FastAPI) with a single command.
- Appointment management with multiple statuses: Confirm, Complete, NoShow, Reschedule, Cancel.
- Smart filtering: Doctors can only see their own appointments; Patients can only see theirs.
- Fluent Validation and Transaction support for data integrity.
- Role-based restrictions to prevent unauthorized access.
- Postman Test Collection included for easy API testing.

---

## Technologies Used

- ASP.NET Core 8 Web API
- FastAPI (Python 3.12)
- XGBoost & Scikit-learn (Machine Learning)
- SQL Server
- Docker & Docker Compose
- JWT Authentication & Role-Based Authorization
- Fluent Validation
- Unit of Work & Generic Repository
- Swagger UI & OpenAPI

---

## How to Run with Docker

1. Clone the project and navigate to the root folder.
2. Run the following command:
   ```bash
   docker-compose up -d --build
   ```
3. Access the .NET Backend at: http://localhost:64240/swagger
4. Access the AI Service Docs at: http://localhost:8000/docs

---

## How to Run Locally (Manual)

### 1. AI Service (Python):
1. Navigate to the ClinicAI folder: `cd ClinicAI`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the service: `uvicorn main:app --host 0.0.0.0 --port 8000`

### 2. Backend (.NET):
1. Navigate to the Clinic Project folder: `cd "Clinic Project"`
2. Set your connection string in `appsettings.json`.
3. Run the project: `dotnet run`

---

Chikh Oulad Laid Backend Developer - ASP.NET Core
[LinkedIn](https://www.linkedin.com/in/chikhouladlaid) | [GitHub](https://github.com/chikh97laid)
