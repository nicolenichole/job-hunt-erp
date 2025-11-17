from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from app.models import ApplicationStatus

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Company schemas
class CompanyBase(BaseModel):
    name: str
    website: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None

class CompanyResponse(CompanyBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Contact schemas
class ContactBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    title: Optional[str] = None
    linkedin: Optional[str] = None
    notes: Optional[str] = None
    company_id: Optional[int] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    title: Optional[str] = None
    linkedin: Optional[str] = None
    notes: Optional[str] = None
    company_id: Optional[int] = None

class ContactResponse(ContactBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Application schemas
class ApplicationBase(BaseModel):
    job_title: str
    job_description: Optional[str] = None
    job_url: Optional[str] = None
    status: ApplicationStatus = ApplicationStatus.SAVED
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: str = "USD"
    applied_date: Optional[datetime] = None
    notes: Optional[str] = None
    resume_version: Optional[str] = None
    cover_letter_version: Optional[str] = None
    company_id: int

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    job_url: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: Optional[str] = None
    applied_date: Optional[datetime] = None
    notes: Optional[str] = None
    resume_version: Optional[str] = None
    cover_letter_version: Optional[str] = None
    company_id: Optional[int] = None

class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Interview schemas
class InterviewBase(BaseModel):
    application_id: int
    interview_type: Optional[str] = None
    scheduled_at: datetime
    location: Optional[str] = None
    interviewer_name: Optional[str] = None
    interviewer_email: Optional[str] = None
    notes: Optional[str] = None
    feedback: Optional[str] = None
    result: Optional[str] = None

class InterviewCreate(InterviewBase):
    pass

class InterviewUpdate(BaseModel):
    application_id: Optional[int] = None
    interview_type: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    location: Optional[str] = None
    interviewer_name: Optional[str] = None
    interviewer_email: Optional[str] = None
    notes: Optional[str] = None
    feedback: Optional[str] = None
    result: Optional[str] = None

class InterviewResponse(InterviewBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardStats(BaseModel):
    total_applications: int
    applications_by_status: dict
    upcoming_interviews: int
    total_companies: int
    total_contacts: int
    recent_applications: List[ApplicationResponse]
    recent_interviews: List[InterviewResponse]

