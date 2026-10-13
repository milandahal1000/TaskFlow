# TaskFlow — Product Requirements Document (PRD)

**Version:** 1.1  
**Status:** Initial specification  
**Product type:** Full-stack web application  
**Target:** Beginner developer portfolio project

## 1. Product overview

TaskFlow is a personal task and project management web application. It helps users organize work into projects, create tasks, set deadlines and priorities, monitor progress, and review their workload through a dashboard.

## 2. Problem statement

People often manage work across notes, spreadsheets, and separate apps. This makes it difficult to see deadlines, identify priorities, and understand progress. TaskFlow provides one centralized, simple interface for personal productivity.

## 3. Product goals

1. Organize work into projects.
2. Support complete task CRUD (create, read, update, delete).
3. Make status, priority, and deadlines easy to monitor.
4. Provide useful dashboard summaries.
5. Demonstrate React, Django REST Framework, relational database, JWT authentication, testing, and deployment skills.
6. Provide a clean light theme and a user-selectable dark theme.

## 4. Target users

**Primary:** Individuals managing study assignments, personal goals, freelance work, or small projects.  
**Secondary:** Students and early-career developers seeking a lightweight productivity tool.

The MVP is for individual use; team collaboration is out of scope.

## 5. Core functional requirements

### FR-01: Account and authentication
- Register using username, email, and password.
- Log in and obtain JWT access/refresh tokens through the configured authentication flow.
- Refresh an expired access token when a valid refresh token is available.
- Log out by clearing client authentication state and, if token blacklisting is configured, invalidating the refresh token.
- View the currently authenticated user's profile.
- Protect private routes and API endpoints.
- Restrict all data access to the authenticated user's own projects and tasks.

### FR-02: Project management
- Create a project with a required name and optional description.
- List and open the user's projects.
- Edit project details.
- Delete a project after confirmation.
- Show task counts and completion progress.
- Explain that deleting a project also deletes its tasks.

### FR-03: Task management
- Create, view, edit, complete, and delete tasks.
- Every task must belong to a project.
- Store title, optional description, status, priority, optional due date, and timestamps.
- Status values: To Do, In Progress, Completed.
- Priority values: Low, Medium, High.
- Display clear confirmation before destructive actions.

### FR-04: Dashboard
Display:
- Total projects.
- Total tasks.
- Tasks in progress.
- Completed tasks.
- Overdue incomplete tasks.
- Upcoming deadlines.
- Recently created or updated tasks.
- Quick actions to create a project or task.

Dashboard values must be derived from the current user's data only.

### FR-05: Search, filters, and sorting
- Search tasks by title.
- Filter by status, priority, and project.
- Sort by due date or creation date.
- Allow search, filters, and sorting to be combined.
- Show an informative empty state when no results match.

### FR-06: Theme toggle
- Provide a visible light/dark theme toggle in the account menu or top navigation.
- Default to light theme for first-time visitors.
- Remember the user's selection between visits using local browser storage.
- Apply theme consistently to pages, cards, forms, dialogs, badges, and navigation.
- Respect system theme only if the user has not explicitly selected a theme.
- Ensure readable contrast in both themes.

### FR-07: Responsive design
Support desktop, tablet, and mobile layouts. Navigation, cards, forms, and task lists must remain usable on narrow screens.

## 6. User stories

| ID | User story | Priority |
|---|---|---|
| US-01 | As a visitor, I can register and log in. | Must |
| US-02 | As a user, I can create and manage projects. | Must |
| US-03 | As a user, I can create and manage tasks. | Must |
| US-04 | As a user, I can set deadlines, priorities, and statuses. | Must |
| US-05 | As a user, I can view my workload on a dashboard. | Must |
| US-06 | As a user, I can search, filter, and sort tasks. | Must |
| US-07 | As a user, I can switch between light and dark themes. | Must |
| US-08 | As a user, I can refresh an expired access token securely. | Must |
| US-09 | As a user, I can use a Kanban board. | Could |
| US-10 | As a user, I can export tasks to CSV. | Could |

## 7. Non-functional requirements

### Security
- Use Django password hashing.
- Use short-lived JWT access tokens and a controlled refresh-token lifetime.
- Prefer refresh-token storage in Secure, HttpOnly cookies when the deployment architecture supports it, with CSRF protection and appropriate SameSite settings. If using a different storage strategy, document its trade-offs and avoid treating localStorage as a secure vault.
- Enforce ownership on every protected API query and mutation.
- Validate all input on the server.
- Never commit secrets or real tokens to Git.
- Use HTTPS and `DEBUG=False` in production.

### Usability
- Provide clear labels and validation messages.
- Show loading, error, success, and empty states.
- Require confirmation for destructive actions.
- Maintain keyboard accessibility and visible focus.

### Performance
- Under light demo workloads, aim for normal API responses under 500 ms excluding network latency and hosting cold starts.
- Avoid redundant dashboard requests.
- Add pagination when list sizes warrant it.

### Maintainability
- Keep frontend and backend modular.
- Document environment setup and API endpoints.
- Test core backend behavior and critical frontend flows.

## 8. MVP scope

### Included
Authentication with JWT, project CRUD, task CRUD, status/priority/deadline fields, dashboard, search/filter/sort, responsive layout, light/dark theme toggle, authorization, validation, and automated tests.

### Excluded from MVP
Team collaboration, real-time updates, calendar integrations, file attachments, payments, AI-generated tasks, native mobile apps, and advanced notification systems.

## 9. Success criteria

The MVP is successful when:
1. A new user can register, log in, refresh authentication, and log out.
2. Users can manage only their own projects and tasks.
3. Project and task CRUD work end-to-end.
4. Dashboard counts match saved data.
5. Search and filters return expected results.
6. Light/dark theme selection is consistent across pages and persists between visits.
7. Core backend tests pass, including cross-user access tests.
8. Setup instructions work on a clean development environment.
9. The app can be demonstrated locally or online.
