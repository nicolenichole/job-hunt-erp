from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db
from app.models import Interview, User
from app.schemas import InterviewCreate, InterviewUpdate, InterviewResponse
from app.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[InterviewResponse])
async def get_interviews(
    skip: int = 0,
    limit: int = 100,
    application_id: Optional[int] = None,
    upcoming_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Interview).filter(Interview.user_id == current_user.id)
    
    if application_id:
        query = query.filter(Interview.application_id == application_id)
    
    if upcoming_only:
        query = query.filter(Interview.scheduled_at >= datetime.utcnow())
    
    interviews = query.order_by(Interview.scheduled_at).offset(skip).limit(limit).all()
    return interviews

@router.get("/{interview_id}", response_model=InterviewResponse)
async def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = db.query(Interview).filter(
        and_(Interview.id == interview_id, Interview.user_id == current_user.id)
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

@router.post("/", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
async def create_interview(
    interview: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_interview = Interview(**interview.dict(), user_id=current_user.id)
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

@router.put("/{interview_id}", response_model=InterviewResponse)
async def update_interview(
    interview_id: int,
    interview_update: InterviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = db.query(Interview).filter(
        and_(Interview.id == interview_id, Interview.user_id == current_user.id)
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    update_data = interview_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(interview, field, value)
    
    db.commit()
    db.refresh(interview)
    return interview

@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = db.query(Interview).filter(
        and_(Interview.id == interview_id, Interview.user_id == current_user.id)
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    db.delete(interview)
    db.commit()
    return None

