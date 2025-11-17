# Job Hunt ERP

A comprehensive Enterprise Resource Planning (ERP) system designed to help you manage your entire job search process. Track applications, manage companies and contacts, schedule interviews, and analyze your job search progress.

## Features

- **Application Management**: Track job applications with status, salary information, and application dates
- **Company Management**: Store and organize information about companies you're interested in
- **Contact Management**: Keep track of professional contacts and their details
- **Interview Scheduling**: Schedule and manage interviews with detailed information
- **Dashboard Analytics**: Visualize your job search progress with charts and statistics
- **User Authentication**: Secure login and registration system

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database (can be upgraded to PostgreSQL)
- **JWT**: Token-based authentication
- **Pydantic**: Data validation

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Recharts**: Chart library for analytics
- **Axios**: HTTP client

## Project Structure

```
job-hunt-erp/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── database.py           # Database configuration
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── schemas.py            # Pydantic schemas
│   │   ├── auth.py               # Authentication utilities
│   │   └── routers/              # API route handlers
│   │       ├── auth.py
│   │       ├── applications.py
│   │       ├── companies.py
│   │       ├── contacts.py
│   │       ├── interviews.py
│   │       └── dashboard.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── contexts/             # React contexts (Auth)
│   │   ├── pages/                # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation (Swagger UI) will be available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account or login to access the system
2. **Add Companies**: Start by adding companies you're interested in
3. **Create Applications**: Add job applications linked to companies
4. **Add Contacts**: Store contact information for recruiters and hiring managers
5. **Schedule Interviews**: Create interview records linked to applications
6. **View Dashboard**: Monitor your job search progress with analytics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user information

### Applications
- `GET /api/applications/` - List all applications
- `POST /api/applications/` - Create a new application
- `GET /api/applications/{id}` - Get application details
- `PUT /api/applications/{id}` - Update an application
- `DELETE /api/applications/{id}` - Delete an application

### Companies
- `GET /api/companies/` - List all companies
- `POST /api/companies/` - Create a new company
- `GET /api/companies/{id}` - Get company details
- `PUT /api/companies/{id}` - Update a company
- `DELETE /api/companies/{id}` - Delete a company

### Contacts
- `GET /api/contacts/` - List all contacts
- `POST /api/contacts/` - Create a new contact
- `GET /api/contacts/{id}` - Get contact details
- `PUT /api/contacts/{id}` - Update a contact
- `DELETE /api/contacts/{id}` - Delete a contact

### Interviews
- `GET /api/interviews/` - List all interviews
- `POST /api/interviews/` - Create a new interview
- `GET /api/interviews/{id}` - Get interview details
- `PUT /api/interviews/{id}` - Update an interview
- `DELETE /api/interviews/{id}` - Delete an interview

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Application Statuses

- `saved` - Application saved but not yet submitted
- `applied` - Application submitted
- `phone_screen` - Phone screening scheduled/completed
- `interview` - Interview scheduled/completed
- `final_interview` - Final round interview
- `offer` - Offer received
- `rejected` - Application rejected
- `withdrawn` - Application withdrawn

## Security Notes

⚠️ **Important**: This is a development setup. For production:

1. Change the `SECRET_KEY` in `backend/app/auth.py` to a strong, random secret
2. Use environment variables for sensitive configuration
3. Set up proper CORS policies
4. Use a production database (PostgreSQL recommended)
5. Enable HTTPS
6. Implement rate limiting
7. Add input validation and sanitization
8. Set up proper logging and monitoring

## Database

The application uses SQLite by default for simplicity. The database file (`job_hunt_erp.db`) will be created automatically in the backend directory when you first run the application.

To use PostgreSQL instead:
1. Install PostgreSQL and create a database
2. Update `DATABASE_URL` in `backend/app/database.py` or set it as an environment variable
3. Install PostgreSQL driver: `pip install psycopg2-binary`

## Development

### Backend Development
- The API uses FastAPI's automatic OpenAPI documentation
- Access Swagger UI at `/docs` or ReDoc at `/redoc`
- Database migrations can be handled with Alembic (not included, but recommended for production)

### Frontend Development
- Hot module replacement is enabled
- TypeScript strict mode is enabled
- Tailwind CSS is configured for JIT compilation

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

