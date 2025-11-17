from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models  # Import models to register them with SQLAlchemy
from app.routers import auth, applications, companies, contacts, interviews, dashboard

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Job Hunt ERP",
    description="Enterprise Resource Planning system for job search process",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["contacts"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["interviews"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.get("/")
async def root():
    return {"message": "Job Hunt ERP API"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

