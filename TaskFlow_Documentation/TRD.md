# TaskFlow — Technical Requirements Document (TRD)

**Version:** 1.1  
**Architecture:** React SPA + Django REST API  
**Authentication:** JWT

## 1. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Language | JavaScript |
| Routing | React Router |
| HTTP client | Axios |
| Styling | CSS variables and CSS Modules or organized CSS |
| Backend | Python + Django |
| API | Django REST Framework |
| JWT | Simple JWT (`djangorestframework-simplejwt`) |
| Database | SQLite for development; PostgreSQL recommended for production |
| Backend tests | Django TestCase or pytest |
| Frontend tests | Vitest + React Testing Library |
| Version control | Git + GitHub |

Pin tested dependency versions in the relevant package/requirements files.

## 2. Architecture

```text
Browser
  └── React + Vite
       ├── React Router (pages and protected routes)
       ├── Theme provider (light/dark)
       └── Axios API client
             │ HTTPS / JSON
             ▼
       Django REST Framework
         ├── JWT authentication
         ├── serializers and validation
         ├── permissions and ownership filters
         ├── project/task/dashboard endpoints
         └── Django ORM
               ▼
          SQLite (development) / PostgreSQL (production)
```

## 3. Frontend modules

- `api/`: Axios client and endpoint functions.
- `components/layout/`: sidebar, topbar, page shell.
- `components/tasks/`: task card, task form, task filters.
- `components/projects/`: project card and project form.
- `components/common/`: buttons, badges, dialogs, loading/error/empty states.
- `pages/`: login, registration, dashboard, projects, project details, tasks, task details, not found.
- `routes/`: protected route logic.
- `context/` or `providers/`: authentication and theme state.
- `styles/`: theme tokens and global styles.

Suggested structure:

```text
frontend/
  src/
    api/
    components/
    context/
    pages/
    routes/
    styles/
    App.jsx
    main.jsx
  .env.example
  package.json
```

## 4. Backend modules

Use Django apps with focused responsibilities:
- `accounts`: registration and current-user endpoint.
- `projects`: project model and endpoints.
- `tasks`: task model and endpoints.
- `dashboard`: aggregated summary endpoints.

Suggested structure:

```text
backend/
  config/
    settings.py
    urls.py
  apps/
    accounts/
    projects/
    tasks/
    dashboard/
  manage.py
  requirements.txt
  .env.example
```

## 5. API conventions

Prefix endpoints with `/api/v1/`. Use JSON request and response bodies. Use pagination for list endpoints if needed. Use consistent validation error responses.

### JWT authentication endpoints
With Simple JWT, a typical configuration is:
- `POST /api/v1/auth/register/` — register user (custom endpoint).
- `POST /api/v1/auth/token/` — obtain access and refresh tokens.
- `POST /api/v1/auth/token/refresh/` — refresh access token.
- `POST /api/v1/auth/logout/` — custom logout endpoint; blacklist refresh token if the blacklist app is enabled.
- `GET /api/v1/auth/me/` — return current user.

### Projects
- `GET /api/v1/projects/`
- `POST /api/v1/projects/`
- `GET /api/v1/projects/{id}/`
- `PATCH /api/v1/projects/{id}/`
- `DELETE /api/v1/projects/{id}/`

### Tasks
- `GET /api/v1/tasks/`
- `POST /api/v1/tasks/`
- `GET /api/v1/tasks/{id}/`
- `PATCH /api/v1/tasks/{id}/`
- `DELETE /api/v1/tasks/{id}/`

Useful query parameters: `search`, `status`, `priority`, `project`, `ordering`, `page`.

### Dashboard
- `GET /api/v1/dashboard/summary/`
- `GET /api/v1/dashboard/upcoming-tasks/`

## 6. JWT design requirements

Use `djangorestframework-simplejwt` rather than hand-writing JWT generation or validation.

- Access tokens should be short-lived.
- Refresh tokens should have a defined expiry.
- Configure refresh rotation and blacklist behavior deliberately.
- Never put passwords or secrets inside token claims.
- Validate authentication server-side on every protected request.
- Clear client authentication state at logout.
- If refresh-token blacklisting is used, add `rest_framework_simplejwt.token_blacklist` and run migrations.
- Choose token storage based on deployment architecture. For browser applications, prefer refresh tokens in Secure, HttpOnly cookies when implemented correctly, and protect cookie-authenticated refresh/logout requests against CSRF. If the project instead uses in-memory access tokens and a different refresh strategy, document that choice.
- Do not assume that a React protected route replaces backend authorization.

## 7. Security and authorization

- Require authentication for project, task, and dashboard endpoints.
- Filter project querysets by `owner=request.user`.
- Filter task querysets by `project__owner=request.user`.
- Assign project ownership from `request.user`, never from a trusted client-provided owner field.
- Validate that a task's selected project belongs to the current user.
- Test both read and write attempts across two different users.
- Keep production secrets in environment variables.
- Configure allowed hosts, CORS, CSRF, HTTPS, and secure cookie settings for the actual deployment.
- Do not expose Django debug pages in production.

## 8. Theme implementation

Use CSS custom properties for design tokens, such as `--bg`, `--surface`, `--text`, `--muted`, `--border`, and `--primary`. Put `data-theme="light"` or `data-theme="dark"` on the document root or app container. A React theme provider should initialize from saved preference, default to light for first-time visitors, and persist the explicit selection in localStorage. Theme preference is a UI preference, not sensitive authentication data.

## 9. Validation and error handling

Use server-side validation for all important rules:
- Project name and task title cannot be blank.
- Status and priority must be allowed choices.
- Dates must be valid.
- Related project must belong to the requesting user.
- Client must not set ownership.
- Return suitable HTTP status codes: 200, 201, 204, 400, 401, 403/404, and 500 as appropriate.
- Avoid leaking stack traces or private data to users.

## 10. Testing

Backend tests:
- Registration and token acquisition.
- Token refresh and logout/blacklisting behavior.
- Project and task CRUD.
- Cross-user object access.
- Invalid status, priority, and related project.
- Filtering, ordering, and dashboard totals.

Frontend tests:
- Login/registration validation.
- Protected route behavior.
- API loading and error states.
- CRUD form behavior.
- Theme toggle and persistence.
- Search/filter behavior.

## 11. Environment configuration

Keep frontend and backend environment files separate.

Frontend `.env.example`:
```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Backend `.env.example`:
```text
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=replace-with-a-local-development-secret
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

The values above are examples only. Never use development settings or placeholder secrets in production.
