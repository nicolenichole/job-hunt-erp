"""
Script to seed the database with mock data for testing.
Run this script to create a test user account and sample data.
"""
from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app.models import User, Company, Application, Contact, Interview, ApplicationStatus
from app.auth import get_password_hash
from app import models  # Import models to register them

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def get_or_create_user(db):
    """Get existing user or create a new one."""
    user = db.query(User).filter(User.email == "student@example.com").first()
    if not user:
        hashed_password = get_password_hash("password123")
        user = User(
            email="student@example.com",
            hashed_password=hashed_password,
            full_name="Test Student"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print("✓ Created user: student@example.com")
    else:
        print("✓ Using existing user: student@example.com")
    return user

def create_companies(db, user):
    """Create sample companies."""
    companies_data = [
        {
            "name": "TechCorp Inc.",
            "website": "https://techcorp.com",
            "industry": "Technology",
            "size": "500-1000 employees",
            "location": "San Francisco, CA",
            "description": "Leading technology company specializing in cloud solutions"
        },
        {
            "name": "DataSystems Ltd",
            "website": "https://datasystems.io",
            "industry": "Data Analytics",
            "size": "100-500 employees",
            "location": "New York, NY",
            "description": "Data analytics and business intelligence solutions"
        },
        {
            "name": "StartupXYZ",
            "website": "https://startupxyz.com",
            "industry": "FinTech",
            "size": "50-100 employees",
            "location": "Austin, TX",
            "description": "Innovative fintech startup disrupting payment solutions"
        },
        {
            "name": "GlobalSoft",
            "website": "https://globalsoft.com",
            "industry": "Software Development",
            "size": "1000+ employees",
            "location": "Seattle, WA",
            "description": "Enterprise software solutions provider"
        }
    ]
    
    companies = []
    for company_data in companies_data:
        existing = db.query(Company).filter(
            Company.name == company_data["name"],
            Company.user_id == user.id
        ).first()
        if not existing:
            company = Company(**company_data, user_id=user.id)
            db.add(company)
            companies.append(company)
        else:
            companies.append(existing)
    
    db.commit()
    for company in companies:
        db.refresh(company)
    print(f"✓ Created/updated {len(companies)} companies")
    return companies

def create_applications(db, user, companies):
    """Create sample job applications."""
    applications_data = [
        {
            "job_title": "Senior Software Engineer",
            "company": companies[0],
            "status": ApplicationStatus.APPLIED,
            "job_url": "https://techcorp.com/careers/senior-software-engineer",
            "salary_min": 120000,
            "salary_max": 160000,
            "applied_date": datetime.now() - timedelta(days=5),
            "notes": "Great company culture, interesting projects"
        },
        {
            "job_title": "Data Scientist",
            "company": companies[1],
            "status": ApplicationStatus.INTERVIEW,
            "job_url": "https://datasystems.io/careers/data-scientist",
            "salary_min": 110000,
            "salary_max": 140000,
            "applied_date": datetime.now() - timedelta(days=10),
            "notes": "Second round interview scheduled"
        },
        {
            "job_title": "Full Stack Developer",
            "company": companies[2],
            "status": ApplicationStatus.PHONE_SCREEN,
            "job_url": "https://startupxyz.com/jobs/full-stack",
            "salary_min": 90000,
            "salary_max": 120000,
            "applied_date": datetime.now() - timedelta(days=3),
            "notes": "Phone screen completed, waiting for next steps"
        },
        {
            "job_title": "Backend Engineer",
            "company": companies[0],
            "status": ApplicationStatus.SAVED,
            "job_url": "https://techcorp.com/careers/backend-engineer",
            "salary_min": 100000,
            "salary_max": 130000,
            "applied_date": None,
            "notes": "Planning to apply next week"
        },
        {
            "job_title": "Machine Learning Engineer",
            "company": companies[3],
            "status": ApplicationStatus.OFFER,
            "job_url": "https://globalsoft.com/careers/ml-engineer",
            "salary_min": 130000,
            "salary_max": 170000,
            "applied_date": datetime.now() - timedelta(days=20),
            "notes": "Received offer! Negotiating terms."
        },
        {
            "job_title": "Product Manager",
            "company": companies[1],
            "status": ApplicationStatus.REJECTED,
            "job_url": "https://datasystems.io/careers/product-manager",
            "salary_min": 115000,
            "salary_max": 145000,
            "applied_date": datetime.now() - timedelta(days=15),
            "notes": "Not selected, but received positive feedback"
        }
    ]
    
    applications = []
    for app_data in applications_data:
        company = app_data.pop("company")
        existing = db.query(Application).filter(
            Application.job_title == app_data["job_title"],
            Application.company_id == company.id,
            Application.user_id == user.id
        ).first()
        if not existing:
            application = Application(
                **app_data,
                company_id=company.id,
                user_id=user.id
            )
            db.add(application)
            applications.append(application)
        else:
            applications.append(existing)
    
    db.commit()
    for app in applications:
        db.refresh(app)
    print(f"✓ Created/updated {len(applications)} applications")
    return applications

def create_contacts(db, user, companies):
    """Create sample contacts."""
    contacts_data = [
        {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@techcorp.com",
            "phone": "+1-555-0101",
            "title": "Senior Recruiter",
            "linkedin": "https://linkedin.com/in/sarahjohnson",
            "company": companies[0],
            "notes": "Very responsive, helpful throughout the process"
        },
        {
            "name": "Michael Chen",
            "email": "mchen@datasystems.io",
            "phone": "+1-555-0102",
            "title": "Hiring Manager",
            "linkedin": "https://linkedin.com/in/michaelchen",
            "company": companies[1],
            "notes": "Conducted the technical interview"
        },
        {
            "name": "Emily Rodriguez",
            "email": "emily@startupxyz.com",
            "title": "Talent Acquisition",
            "linkedin": "https://linkedin.com/in/emilyrodriguez",
            "company": companies[2],
            "notes": "Initial point of contact"
        },
        {
            "name": "David Kim",
            "email": "david.kim@globalsoft.com",
            "title": "Engineering Manager",
            "linkedin": "https://linkedin.com/in/davidkim",
            "company": companies[3],
            "notes": "Made the offer, great to work with"
        }
    ]
    
    contacts = []
    for contact_data in contacts_data:
        company = contact_data.pop("company")
        existing = db.query(Contact).filter(
            Contact.name == contact_data["name"],
            Contact.email == contact_data.get("email"),
            Contact.user_id == user.id
        ).first()
        if not existing:
            contact = Contact(
                **contact_data,
                company_id=company.id,
                user_id=user.id
            )
            db.add(contact)
            contacts.append(contact)
        else:
            contacts.append(existing)
    
    db.commit()
    for contact in contacts:
        db.refresh(contact)
    print(f"✓ Created/updated {len(contacts)} contacts")
    return contacts

def create_interviews(db, user, applications):
    """Create sample interviews."""
    interviews_data = [
        {
            "application": applications[1],  # Data Scientist
            "interview_type": "Video Call",
            "scheduled_at": datetime.now() + timedelta(days=2, hours=14),
            "location": "Zoom",
            "interviewer_name": "Michael Chen",
            "interviewer_email": "mchen@datasystems.io",
            "notes": "Technical interview focusing on ML algorithms",
            "result": None
        },
        {
            "application": applications[1],  # Data Scientist - follow-up
            "interview_type": "Onsite",
            "scheduled_at": datetime.now() + timedelta(days=7, hours=10),
            "location": "New York Office",
            "interviewer_name": "Team Lead",
            "notes": "Final round with the team",
            "result": None
        },
        {
            "application": applications[2],  # Full Stack Developer
            "interview_type": "Phone Screen",
            "scheduled_at": datetime.now() - timedelta(days=1, hours=2),
            "location": "Phone",
            "interviewer_name": "Emily Rodriguez",
            "notes": "Initial screening call",
            "result": "passed"
        },
        {
            "application": applications[4],  # ML Engineer
            "interview_type": "Video Call",
            "scheduled_at": datetime.now() - timedelta(days=5, hours=15),
            "location": "Microsoft Teams",
            "interviewer_name": "David Kim",
            "interviewer_email": "david.kim@globalsoft.com",
            "notes": "Technical deep dive, went very well",
            "result": "passed"
        }
    ]
    
    interviews = []
    for interview_data in interviews_data:
        application = interview_data.pop("application")
        existing = db.query(Interview).filter(
            Interview.application_id == application.id,
            Interview.scheduled_at == interview_data["scheduled_at"],
            Interview.user_id == user.id
        ).first()
        if not existing:
            interview = Interview(
                **interview_data,
                application_id=application.id,
                user_id=user.id
            )
            db.add(interview)
            interviews.append(interview)
        else:
            interviews.append(existing)
    
    db.commit()
    for interview in interviews:
        db.refresh(interview)
    print(f"✓ Created/updated {len(interviews)} interviews")
    return interviews

def seed_all_data():
    """Create all mock data."""
    db = SessionLocal()
    try:
        print("=" * 50)
        print("Seeding database with mock data...")
        print("=" * 50)
        
        # Create or get user
        user = get_or_create_user(db)
        
        # Create companies
        companies = create_companies(db, user)
        
        # Create applications
        applications = create_applications(db, user, companies)
        
        # Create contacts
        contacts = create_contacts(db, user, companies)
        
        # Create interviews
        interviews = create_interviews(db, user, applications)
        
        print("=" * 50)
        print("✓ Database seeding completed successfully!")
        print("=" * 50)
        print(f"\nSummary:")
        print(f"  - User: 1")
        print(f"  - Companies: {len(companies)}")
        print(f"  - Applications: {len(applications)}")
        print(f"  - Contacts: {len(contacts)}")
        print(f"  - Interviews: {len(interviews)}")
        print(f"\nLogin with:")
        print(f"  Email: student@example.com")
        print(f"  Password: password123")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_all_data()

