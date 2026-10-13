# TaskFlow — Implementation Plan

**Target:** Beginner-friendly full-stack portfolio project  
**Stack:** React + Vite, Django REST Framework, SQLite, JWT  
**Design:** Clean light dashboard with dark theme toggle

## Phase 1 — Environment setup

Tasks:
1. Create a GitHub repository named `taskflow` or another available repository name.
2. Create the React app with Vite.
3. Create and activate a Python virtual environment.
4. Install Django, Django REST Framework, and Simple JWT.
5. Create the Django project and apps.
6. Configure SQLite.
7. Add `.gitignore` and separate `.env.example` files.
8. Confirm frontend and backend start successfully.

Deliverable: React and Django run locally.

Done when: React renders a page and Django responds to a test endpoint.

## Phase 2 — Models and database

Tasks:
1. Implement Project and Task models.
2. Configure status and priority choices.
3. Add foreign keys and cascade behavior.
4. Register models in Django admin if useful.
5. Run migrations.
6. Add model tests.

Deliverable: Working relational schema.

Done when: Projects and tasks can be created and queried locally.

## Phase 3 — JWT authentication

Tasks:
1. Configure `djangorestframework-simplejwt`.
2. Create registration endpoint.
3. Configure token obtain and refresh endpoints.
4. Implement current-user endpoint.
5. Implement logout; add refresh-token blacklist support if selected.
6. Choose and document token storage strategy.
7. Configure protected API permissions.
8. Test invalid credentials, expiry/refresh behavior, logout, and unauthorized access.

Deliverable: Secure, documented authentication flow.

Done when: A user can register, log in, access protected endpoints, refresh according to the design, and log out.

## Phase 4 — Backend APIs

Tasks:
1. Build Project serializers and CRUD endpoints.
2. Build Task serializers and CRUD endpoints.
3. Enforce user ownership in querysets and related-object validation.
4. Add search, filtering, ordering, and pagination as appropriate.
5. Implement dashboard summary and upcoming-task endpoints.
6. Add structured validation errors.
7. Write API tests, including cross-user access tests.

Deliverable: Tested backend API.

Done when: All core API workflows work and users cannot access another user's records.

## Phase 5 — Frontend foundation and design system

Tasks:
1. Configure React Router.
2. Build app layout, sidebar, and topbar.
3. Define design tokens with CSS variables.
4. Build reusable buttons, inputs, cards, badges, and dialogs.
5. Implement light theme and dark theme toggle.
6. Persist explicit theme selection in localStorage.
7. Build loading, error, and empty states.
8. Implement login and registration pages.

Deliverable: Responsive application shell.

Done when: Navigation works and the theme toggle changes all main UI surfaces consistently.

## Phase 6 — Authentication integration

Tasks:
1. Create Axios client and API service functions.
2. Connect registration and login forms.
3. Implement authentication state.
4. Add protected routes.
5. Implement refresh handling according to the chosen JWT storage strategy.
6. Prevent refresh loops and clear authentication state when refresh fails.
7. Add logout behavior.
8. Test expired and invalid tokens.

Deliverable: Frontend connected to JWT authentication.

Done when: Protected pages and API requests behave correctly for logged-in and logged-out users.

## Phase 7 — Project management

Tasks:
1. Build project list and cards.
2. Build create/edit project forms.
3. Build project details page.
4. Connect project CRUD endpoints.
5. Add delete confirmation.
6. Handle loading, empty, validation, and server-error states.

Deliverable: Project management interface.

Done when: A user can create, read, update, and delete their own projects.

## Phase 8 — Task management

Tasks:
1. Build task list and task cards.
2. Build create/edit task forms.
3. Add status, priority, project, and due-date fields.
4. Add delete confirmation.
5. Implement search, filters, and sorting.
6. Refresh affected data after successful mutations.
7. Handle API errors without losing form input.

Deliverable: Complete task management workflow.

Done when: Users can create, update, complete, search, filter, and delete tasks.

## Phase 9 — Dashboard

Tasks:
1. Connect dashboard summary API.
2. Display total tasks, in-progress, completed, and overdue cards.
3. Display recent tasks.
4. Display upcoming deadlines.
5. Display project progress.
6. Add loading, empty, error, and retry states.
7. Compare displayed values against test data.

Deliverable: Functional dashboard.

Done when: All counts and lists match the current user's saved records.

## Phase 10 — Testing and quality assurance

Tasks:
1. Test registration, login, refresh, and logout.
2. Test project/task CRUD.
3. Test user ownership restrictions.
4. Test invalid data and invalid relationships.
5. Test filtering and sorting.
6. Test dashboard calculations.
7. Test frontend forms and API states.
8. Test theme persistence and contrast.
9. Check mobile responsiveness and keyboard access.
10. Check that secrets and real tokens are absent from Git.

Deliverable: Tested release candidate.

Done when: Core tests pass and the critical workflows work on desktop and mobile.

## Phase 11 — Deployment and portfolio presentation

Tasks:
1. Choose hosting for the frontend and backend.
2. Configure production environment variables and allowed hosts.
3. Use PostgreSQL for production if supported by the chosen host.
4. Configure HTTPS and frontend/backend origin settings.
5. Set `DEBUG=False` and use a strong secret key.
6. Apply production migrations.
7. Test the deployed app end-to-end.
8. Write a README with setup, features, stack, API routes, and screenshots.
9. Add architecture and ER diagrams.
10. Provide safe demo instructions and fictional sample data.

Deliverable: Public repository and usable demo.

Done when: A new developer can follow the README and understand or run the application.

## Suggested four-week schedule

| Week | Main focus |
|---|---|
| 1 | Setup, models, JWT authentication, initial APIs |
| 2 | API completion, frontend shell, theme toggle, authentication integration |
| 3 | Project/task UI and dashboard |
| 4 | Testing, responsive fixes, README, and deployment |

This is an estimate for part-time learning. Extend the schedule rather than skipping security, authorization, or testing.

## Portfolio upgrades after the MVP

Implement only after the core application is stable:
1. Kanban board.
2. Pagination and improved sorting.
3. CSV export.
4. Better dashboard charts.
5. Optional profile settings.
6. More end-to-end tests.
7. Improved accessibility and deployment monitoring.

## Definition of done

- [ ] JWT authentication and logout work as documented.
- [ ] Project and task CRUD work end-to-end.
- [ ] Ownership is enforced by the backend.
- [ ] Dashboard data is accurate.
- [ ] Search, filters, and sorting work.
- [ ] Light/dark theme works and persists.
- [ ] Responsive layout is usable.
- [ ] Automated tests cover core flows and security boundaries.
- [ ] README and environment setup instructions are complete.
- [ ] A local or deployed demo can be shown to recruiters.
