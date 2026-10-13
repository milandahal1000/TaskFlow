# TaskFlow — UI/UX Design Brief

## 1. Design vision

TaskFlow should feel like a clean, modern SaaS productivity dashboard: calm, structured, approachable, and professional. Follow the previously referenced task-management dashboard direction: a left navigation sidebar, clear page hierarchy, summary cards, task cards, subtle borders, status indicators, and generous whitespace.

The default appearance is a light theme. A dark theme toggle must be available and consistently style all screens.

## 2. Design principles

- Clarity over decoration.
- Common actions should be easy to find.
- Consistent spacing, typography, controls, and status labels.
- Responsive behavior from mobile through desktop.
- Accessible contrast, keyboard focus, and semantic controls.
- Clear feedback for loading, success, errors, empty states, and destructive actions.

## 3. Color tokens

### Light theme
| Token | Value |
|---|---|
| Page background | `#F8FAFC` |
| Surface/card | `#FFFFFF` |
| Primary | `#4F46E5` |
| Primary hover | `#4338CA` |
| Main text | `#0F172A` |
| Secondary text | `#64748B` |
| Border | `#E2E8F0` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Danger | `#DC2626` |

### Dark theme
| Token | Value |
|---|---|
| Page background | `#0B1220` |
| Surface/card | `#111827` |
| Elevated surface | `#1F2937` |
| Primary | `#818CF8` |
| Primary hover | `#A5B4FC` |
| Main text | `#F1F5F9` |
| Secondary text | `#94A3B8` |
| Border | `#334155` |
| Success | `#4ADE80` |
| Warning | `#FBBF24` |
| Danger | `#F87171` |

Check actual contrast ratios for text, badges, and controls before release. Status must not be conveyed by color alone.

## 4. Typography and spacing

- Font: Inter or a similar readable sans-serif.
- Page heading: 24–30 px.
- Section heading: 18–20 px.
- Body text: 14–16 px.
- Supporting text: 12–14 px.
- Use a consistent spacing scale, for example 4, 8, 12, 16, 24, and 32 px.
- Use subtle borders and restrained shadows rather than heavy gradients or excessive effects.

## 5. Desktop layout

- Left sidebar: brand, Dashboard, Projects, Tasks, and account/settings links.
- Topbar: page title or breadcrumbs, optional search, theme toggle, and user menu.
- Main content: dashboard cards and task/project content.
- Use a centered content width or fluid layout with a comfortable maximum width.
- Sidebar may collapse on smaller screens.

## 6. Mobile layout

- Use a drawer, collapsible sidebar, or compact navigation.
- Stack dashboard cards in one column or a responsive two-column grid when space allows.
- Convert wide task tables into cards on narrow screens.
- Forms should use full-width inputs.
- Buttons and icon controls should have touch-friendly target sizes.
- Avoid horizontal scrolling except where it is an intentional board interaction.

## 7. Dashboard screen

### Header
- Page title and short greeting.
- Primary “Create Task” action.
- Theme toggle.
- User/account menu.

### Summary cards
- Total Tasks.
- In Progress.
- Completed.
- Overdue.

### Main sections
- Recent Tasks.
- Upcoming Deadlines.
- Projects / Project Progress.

Provide skeleton or loading states, meaningful empty states, and retry actions for failed requests.

## 8. Projects screen

- Page title and “New Project” button.
- Optional project search.
- Responsive grid of project cards.
- Each card shows name, short description, task completion count, progress, and a menu.
- Confirm deletion and explain that tasks belonging to the project will also be removed.

## 9. Task screen

### List view
- Search by task title.
- Filters for status, priority, and project.
- Sorting by due date or creation date.
- Task title, project, status, priority, due date, and action menu.
- Empty and no-results states.

### Optional Kanban upgrade
Three columns: To Do, In Progress, Completed. Cards show title, project, priority, and due date. If drag-and-drop is added, persist changes through the API and handle failures visibly.

## 10. Forms and dialogs

### Task form
- Title (required).
- Project (required).
- Description (optional).
- Status.
- Priority.
- Due date (optional).

### Project form
- Name (required).
- Description (optional).

Requirements:
- Visible labels and inline validation.
- Disable duplicate submission while saving.
- Preserve entered values on failure.
- Show success feedback after the server confirms the operation.
- Confirm destructive actions.

## 11. Reusable React components

- `AppLayout`
- `Sidebar`
- `Topbar`
- `ThemeToggle`
- `PageHeader`
- `StatCard`
- `ProjectCard`
- `TaskCard`
- `TaskTable`
- `StatusBadge`
- `PriorityBadge`
- `TaskForm`
- `ProjectForm`
- `ConfirmDialog`
- `EmptyState`
- `LoadingState`
- `ErrorState`

## 12. Theme toggle behavior

- Default to light theme for a first-time visitor.
- Provide an accessible toggle or menu option labeled “Switch to dark theme” / “Switch to light theme”.
- Apply theme via CSS custom properties and a root attribute such as `data-theme="dark"`.
- Persist the user's choice in localStorage.
- Avoid a visible flash of the wrong theme where practical.
- Ensure charts, dialogs, dropdowns, form fields, and badges also change theme.
- Do not use theme as an authentication or security mechanism.

## 13. Accessibility

- Use semantic HTML.
- Associate form labels with inputs.
- Support keyboard navigation.
- Show visible focus indicators.
- Provide accessible names for icon-only controls.
- Check contrast in both themes.
- Use text labels in addition to status colors.
- Announce important validation errors to assistive technology.

## 14. UX acceptance criteria

- A new user can locate project/task creation without guidance.
- Main workflows are usable on mobile and desktop.
- Theme selection persists between visits.
- Both themes maintain readability and consistent hierarchy.
- Loading, error, success, empty, and confirmation states exist.
- All primary controls work with a keyboard.
