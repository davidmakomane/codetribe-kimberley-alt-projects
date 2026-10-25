# Task 5 - Shopping List App

A responsive React and TypeScript shopping list app using Redux Toolkit, React Router, and JSON Server. Users can register and log in, manage their profile and password, create categorized shopping lists, manage list items, search and sort through URL parameters, and share read-only links.

## Features

- Registration and login with salted PBKDF2 password hashing.
- Guest-only login and registration routes, protected account pages, and session persistence.
- Profile updates and password changes.
- Shopping list and item create, read, update, and delete operations.
- Item quantities, categories, notes, optional image URLs, and purchased status.
- Search, category filtering, and sorting by name/category/date; query parameters are reflected in the URL and update the view when edited.
- Read-only list sharing links.
- Responsive layout for small and large screens, accessible labels and keyboard focus states.

## Run locally

Use Node.js 20.19+ or 22.12+.

```sh
npm install
npm run server
```

In a second terminal, from the project root:

```sh
npm run dev
```

Open the Vite URL shown in the terminal and register an account. The server command creates an empty local `db.json` from `db.example.json` when needed. The local database is git-ignored so personal records are not committed. The app uses `http://localhost:3001` by default; set `VITE_API_URL` in a local `.env` file to point to another API base URL.

## Check the project

```sh
npm run build
npm run lint
```

## Project planning and algorithms

See [docs/TASK5_PLAN.md](docs/TASK5_PLAN.md) for the design summary, step-by-step plan, pseudocode, and core algorithms.

## Data and security notes

Passwords are salted and hashed with PBKDF2; they are not decrypted at login. JSON Server is a local development API, not a production backend. It does not enforce authentication or ownership against direct API requests. Browser route checks and read-only share links are application behavior, not server security. A production release needs a server that authenticates users, enforces record ownership and share permissions, validates inputs, and protects personal data. Do not deploy this mock API or commit personal records in `db.json`.
