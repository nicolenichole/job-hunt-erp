from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.database import get_db
from app.models import Application, Interview, Company, Contact, User, ApplicationStatus
from app.schemas import DashboardStats, ApplicationResponse, InterviewResponse
from app.auth import get_current_user

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    
    # Total applications
    total_applications = db.query(Application).filter(
        Application.user_id == user_id
    ).count()
    
    # Applications by status
    status_counts = db.query(
        Application.status,
        func.count(Application.id).label('count')
    ).filter(
        Application.user_id == user_id
    ).group_by(Application.status).all()
    
    applications_by_status = {status.value: 0 for status in ApplicationStatus}
    for status, count in status_counts:
        applications_by_status[status.value] = count
    
    # Upcoming interviews (next 7 days)
    upcoming_cutoff = datetime.utcnow() + timedelta(days=7)
    upcoming_interviews = db.query(Interview).filter(
        and_(
            Interview.user_id == user_id,
            Interview.scheduled_at >= datetime.utcnow(),
            Interview.scheduled_at <= upcoming_cutoff
        )
    ).count()
    
    # Total companies
    total_companies = db.query(Company).filter(
        Company.user_id == user_id
    ).count()
    
    # Total contacts
    total_contacts = db.query(Contact).filter(
        Contact.user_id == user_id
    ).count()
    
    # Recent applications (last 5)
    recent_applications = db.query(Application).filter(
        Application.user_id == user_id
    ).order_by(Application.created_at.desc()).limit(5).all()
    
    # Recent interviews (next 5)
    recent_interviews = db.query(Interview).filter(
        and_(
            Interview.user_id == user_id,
            Interview.scheduled_at >= datetime.utcnow()
        )
    ).order_by(Interview.scheduled_at).limit(5).all()
    
    return DashboardStats(
        total_applications=total_applications,
        applications_by_status=applications_by_status,
        upcoming_interviews=upcoming_interviews,
        total_companies=total_companies,
        total_contacts=total_contacts,
        recent_applications=[ApplicationResponse.model_validate(app) for app in recent_applications],
        recent_interviews=[InterviewResponse.model_validate(intv) for intv in recent_interviews]
    )

