# JobTrack – React TypeScript Job Application Tracker

## Project Overview

JobTrack is a responsive job application tracking web application built with React, TypeScript and React Router.

The application helps users keep track of jobs they have applied for, including the company, role, application date, status, location, salary, duties, requirements and contact information.

This project was developed as part of the React TypeScript curriculum and demonstrates React components, state management, forms, routing, URL queries, CRUD operations, validation and responsive UI design.

---

## Features

### Landing Page

- Introduces the JobTrack application.
- Explains the purpose of the application.
- Provides links to registration and login.
- Responsive navigation.

### Registration

- Username field.
- Password field.
- Confirm password field.
- Basic form validation.
- Stores the username for the current prototype.

### Login

- Username and password fields.
- Login validation.
- Redirects users to the dashboard after login.
- Uses protected routes for dashboard pages.

### Dashboard

Users can:

- View job applications.
- Add new job applications.
- Search by company or role.
- Filter applications by status.
- Sort applications by date.
- View application statistics.
- Open detailed job information.
- Delete job applications.

### Job Status

Applications can have one of three statuses:

- Applied
- Interviewed
- Rejected

Each status has a different visual style.

### Job Details

Each application contains:

- Company name
- Job role
- Application status
- Date applied
- Location
- Address
- Salary
- Contact information
- Job duties
- Job requirements

### Edit and Update

Users can edit an existing job application and save the updated information.

### Search, Filter and Sort

The dashboard supports:

- Search by company name.
- Search by job role.
- Filter by application status.
- Sort from newest to oldest.
- Sort from oldest to newest.

Search, filtering and sorting options are reflected in the URL using query parameters.

---

## Technologies Used

- React
- TypeScript
- React Router
- Vite
- JSON Server
- HTML5
- CSS3
- Fetch API
- Git
- GitHub

---

## Project Structure

```text
job-tracker/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── EditJobForm.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobForm.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Home.tsx
│   │   ├── JobDetails.tsx
│   │   └── NotFound.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── db.json
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Application Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing | Introduces JobTrack |
| `/login` | Login | User login |
| `/register` | Registration | Create an account |
| `/home` | Dashboard | Manage job applications |
| `/jobs/:id` | Job Details | View, edit and delete a job |
| `*` | 404 | Handles unknown routes |

---

## URL Query Parameters

### Search

```text
/home?search=developer
```

Searches company names and job roles.

### Status

```text
/home?status=Interviewed
```

Displays applications with the selected status.

### Sorting

```text
/home?sort=asc
```

Displays applications from oldest to newest.

```text
/home?sort=desc
```

Displays applications from newest to oldest.

---

## CRUD Operations

JobTrack uses JSON Server as a local REST API.

### Create

New applications are added using:

```text
POST /jobs
```

### Read

All applications are retrieved using:

```text
GET /jobs
```

Individual applications are retrieved using:

```text
GET /jobs/:id
```

### Update

Existing applications are updated using:

```text
PUT /jobs/:id
```

### Delete

Applications are removed using:

```text
DELETE /jobs/:id
```

---

## JSON Server

The project uses `db.json` as the local database.

The JSON Server API runs on:

```text
http://localhost:3001
```

The jobs endpoint is:

```text
http://localhost:3001/jobs
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/davidmakomane/job-tracker.git
```

Move into the project:

```bash
cd job-tracker
```

Install the dependencies:

```bash
npm install
```

---

## Running the Application

The application requires two development servers.

### 1. Start JSON Server

```bash
npm run server
```

JSON Server will run on:

```text
http://localhost:3001
```

### 2. Start React

Open another terminal and run:

```bash
npm run dev
```

The React application will normally run on:

```text
http://localhost:5173
```

---

## Responsive Design

JobTrack is designed to work across different screen sizes:

- 320px
- 480px
- 768px
- 1024px
- 1200px

The layout adapts navigation, forms, dashboard cards and job cards for smaller screens.

---

## Component Structure

### Navbar

Handles application navigation and logout.

### JobCard

Displays an individual job application and provides actions for viewing and deleting the application.

### JobForm

Provides the form for creating a new job application.

### EditJobForm

Provides the form for updating an existing job application.

### ProtectedRoute

Protects dashboard and job-detail routes from unauthorised access.

---

## React Concepts Demonstrated

This project demonstrates:

- Functional components
- TypeScript interfaces
- Props
- State
- `useState`
- `useEffect`
- React Router
- `BrowserRouter`
- `Routes`
- `Route`
- `Link`
- `NavLink`
- `useNavigate`
- `useParams`
- `useSearchParams`
- Protected routes
- Forms
- Form validation
- Arrays and array methods
- Objects
- Fetch API
- REST API requests
- CRUD operations
- Conditional rendering
- Responsive CSS
- Reusable components

---

## Design

The application is based on the JobTrack wireframe created for the project.

The original layout and navigation structure were retained while the visual theme was adapted to a green colour scheme.

The main design goals are:

- Simple navigation
- Clear job status indicators
- Easy access to job information
- Responsive layouts
- Clear action buttons
- Consistent spacing and typography
- User-friendly forms

---

## Future Improvements

Planned improvements include:

- Improved job details layout.
- Enhanced edit/update interface.
- More complete authentication.
- User-specific job applications.
- Improved validation and error handling.
- Further responsive design improvements.
- Additional UI polishing based on the original wireframe.
- Interview reminders.
- Application analytics.
- Exporting job applications.
- Cloud database integration.

---

## Author

**Letsego David Makomane**

React TypeScript Job Application Tracker

GitHub:

https://github.com/davidmakomane/job-tracker