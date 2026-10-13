# TaskFlow

TaskFlow is a full-stack portfolio project built with Django REST Framework and React + Vite. It helps users manage projects and tasks with JWT-based authentication, protected routes, and a polished dashboard UI.

## Features

- JWT authentication with registration, login, refresh, and logout flows
- Project CRUD with ownership enforcement
- Task CRUD with status, priority, and due-date tracking
- Dashboard metrics and recent activity
- Light and dark theme support
- Responsive layout for portfolio showcase and demos

## Tech stack

- Backend: Django 6.1, Django REST Framework, Simple JWT
- Frontend: React 19, Vite, React Router, Axios
- Database: SQLite for local development

## Project structure

- backend/: Django app and API code
- frontend/: React app and styling
- TaskFlow_Documentation/: planning and product documents

## Local setup

### 1. Create and activate a virtual environment

```bash
cd backend
python -m venv venv
source venv/bin/activate
```

### 2. Install backend dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt
```

### 3. Configure environment variables

Copy the sample environment file:

```bash
cp backend/.env.example backend/.env
```

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 4. Run backend migrations and start the API

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

### 5. Install frontend dependencies

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Example frontend environment:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Demo login

Use a local account created through the register screen or create a user in the Django shell.

## Deployment notes

This project is prepared for a typical deployment flow:

1. Set `DEBUG=False` and provide a secure `SECRET_KEY` in production.
2. Update `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` for your deployed frontend/backend domains.
3. Use a managed database such as PostgreSQL for production hosting.
4. Serve the frontend via a static host or CDN and the backend behind HTTPS.
5. Ensure the frontend `.env` points to the deployed API URL.

## Common commands

```bash
# Backend tests
cd backend
python manage.py test

# Frontend build
cd frontend
npm run build
```

## Portfolio presentation guidance

- Use the dashboard as the main recruiter-facing screen.
- Explain the auth flow, project ownership enforcement, and task lifecycle.
- Highlight the split architecture: Django API + React interface.
- Show the project as a real-world productivity app rather than a tutorial starter.

## License

This project is intended for portfolio and learning purposes.
