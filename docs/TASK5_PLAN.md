# Task 5: Shopping List App

## Design

The app uses a dashboard layout with a dark navigation rail, a light workspace, and high contrast blue action buttons. The dashboard shows searchable, filterable list cards. Each list opens a detail page with item categories, quantities, notes, image URLs, and a purchased state. Forms use labels, inline status messages, keyboard focus rings, and disabled states while saving. The navigation rail becomes a fixed bottom bar on small screens.

Responsive layout adapts at 1024px, 768px, 480px, and 320px. List cards move from a multi-column grid to a single column, and item rows wrap on narrow screens.

## Step-by-step plan

1. Create the React and TypeScript app with Vite and install Redux Toolkit, React Router, Lucide icons, and JSON Server.
2. Define user, shopping list, and item records and configure the Redux store.
3. Build registration and login with input validation, PBKDF2 password hashing, session persistence, and guest/protected routes.
4. Build the dashboard to create, list, edit, delete, search, filter, and sort a user's lists.
5. Add a detail page for item CRUD, categories, quantities, notes, images, purchased state, and progress.
6. Add profile editing, password changes, and read-only sharing links.
7. Synchronize search and sorting with URL query parameters so direct links and browser navigation restore the same view.
8. Document local setup and the JSON Server limitations; run the production build and lint checks.

## Pseudocode

```text
REGISTER(form):
  validate required fields and password length
  normalize email
  reject if email already exists
  generate random salt
  derive password hash with PBKDF2
  save profile, salt, and hash to JSON Server

LOGIN(email, password):
  find user by normalized email
  derive hash with saved salt
  if derived hash differs, show invalid credentials
  otherwise save safe profile in session and open dashboard

LOAD_DASHBOARD(user, URL):
  fetch lists owned by user
  read search, category, and sort from URL parameters
  filter lists by search/category
  sort by name, category, or creation date
  render cards and current URL state

SAVE_LIST(form, user):
  validate name
  create or update list with owner, category, description, and timestamps
  show success or error feedback

OPEN_LIST(id, user, token):
  fetch list
  allow edit when current user owns it
  otherwise allow read-only view only when token matches share token
  fetch items for list and render search/sort state from URL

DELETE_LIST(id, user):
  verify list is owned by user in app state
  delete its items, then delete the list
  update Redux state and show feedback
```

## Core algorithms

- **Password verification:** PBKDF2 with SHA-256 and a random per-user salt derives a 256-bit hash. Login recomputes and compares the derived hash; passwords are never decrypted because they are not stored reversibly.
- **List filtering:** normalize the query to lowercase; match it against list name and description, then apply the selected category.
- **List sorting:** compare names alphabetically, categories alphabetically, or timestamps numerically in ascending/descending order.
- **Item search/sorting:** match the query against name, category, and notes; sort by name, category, date added, or purchased state.
- **Sharing:** create a random token and copy `/shared/:listId?token=...`; the shared route checks the token and presents the list read-only.

## Verification

`npm run build` runs TypeScript project checks and creates the production bundle. `npm run lint` checks the source with ESLint. The app is developed against JSON Server and creates an empty ignored `db.json` from `db.example.json` on first launch; register a local account before use.
