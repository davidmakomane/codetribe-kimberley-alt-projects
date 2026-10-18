# Shopping List App

## 1. Project Overview

The Shopping List App is a web application built with React and TypeScript. It will help users create and manage shopping lists, add and update shopping items, search for items, and sort shopping lists.

The application will use Redux Toolkit for state management, React Router for navigation, Lucide React for icons, and JSON Server as a development API for storing and managing data.

## 2. Project Objectives

- Allow users to register, log in, and log out.
- Create, view, edit, and delete shopping lists.
- Add, update, and remove items from shopping lists.
- Search for shopping lists and items.
- Sort items and lists using relevant options.
- Manage user profile information.
- Build a responsive interface for desktop, tablet, and mobile screens.
- Organise the application using reusable React components and a clear folder structure.

## 3. Technologies

- **React** — builds the user interface.
- **TypeScript** — adds type checking to the code.
- **Vite** — provides the development environment and build tools.
- **Redux Toolkit** — manages application state.
- **React Redux** — connects React components to Redux.
- **React Router** — handles navigation between pages.
- **Lucide React** — provides interface icons.
- **JSON Server** — provides a mock REST API for development.
- **Git and GitHub** — track changes and manage the project repository.

## 4. Step-by-Step Development Plan

### Step 1: Project Setup
- Create the React and TypeScript project using Vite.
- Install the required dependencies.
- Confirm that the application runs locally.
- Save the initial setup on the GitHub branch.

### Step 2: Design and Screen Layouts
- Choose the application's colours, typography, spacing, and overall style.
- Design the Login and Registration screens.
- Design the Home/Dashboard screen.
- Design the Shopping Lists and Shopping List Details screens.
- Design the Profile screen.
- Plan the navigation and responsive layouts.

### Step 3: Create the Source-File Structure
- Organise the project into pages, reusable components, features, services, routes, types, and application configuration.
- Create a consistent structure that makes the code easier to understand and maintain.

### Step 4: Set Up Data and State Management
- Create the development database using `db.json`.
- Configure JSON Server and its API endpoints.
- Set up the Redux store.
- Create Redux slices for authentication and shopping-list data.
- Connect the application to the API.

### Step 5: Implement Authentication
- Build the Registration and Login forms.
- Validate user input.
- Implement the development authentication flow.
- Add logout functionality.
- Protect pages that require authentication.

### Step 6: Implement Shopping List Features
- Create new shopping lists.
- View existing shopping lists.
- Edit list details.
- Delete shopping lists.
- Add items with names, quantities, categories, and optional notes.
- Update and delete shopping items.

### Step 7: Implement Search and Sorting
- Search for shopping lists and items by name.
- Filter items by category.
- Sort results using relevant criteria, such as name or date.
- Display appropriate messages when no results are found.

### Step 8: Implement Profile and Responsive Design
- Display and update profile information.
- Make the interface responsive on desktop, tablet, and mobile screens.
- Improve accessibility, form feedback, loading states, and error messages.

### Step 9: Test the Application
- Test registration, login, and logout.
- Test shopping-list and item operations.
- Test searching, filtering, and sorting.
- Test navigation and protected pages.
- Check form validation and error handling.
- Test different screen sizes and fix identified problems.

### Step 10: Documentation and Submission
- Update this README as the project develops.
- Explain how to install and run the application.
- Document the system design and key features.
- Review the source code and test the production build.
- Commit and push the completed changes to GitHub.
- Prepare the required deliverables and submit the project according to the assignment instructions.

## 5. Current Position

### Completed
- [x] Created the Vite React + TypeScript project.
- [x] Installed Redux Toolkit.
- [x] Installed React Redux.
- [x] Installed React Router.
- [x] Installed Lucide React.
- [x] Installed JSON Server.

### In Progress
- [ ] Finalise the design and screen layouts.
- [ ] Create the complete source-file structure.

### Not Started
- [ ] Implement the application features.
- [ ] Test the application and fix errors.
- [ ] Complete the documentation and submit through GitHub.

## 6. Development Approach

The application will be developed in stages. Each stage will be planned, implemented, and tested before moving to the next stage. Git commits will be used to track progress throughout development.

**Current stage:** Project setup is complete. The next stage is to finalise the design and screen layouts before building the application's features.

## 7. Running the Project Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The terminal will display the local URL where the application can be opened.

*Note: JSON Server and authentication-related functionality will be configured as development progresses. A mock API is not a secure production authentication backend.*
