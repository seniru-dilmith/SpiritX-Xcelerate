# SecureConnect-Spirit11

SecureConnect-Spirit11 is a full‑stack application combining a secure authentication system with a fantasy cricket platform. It features robust user and admin interfaces, role‑based access control (RBAC), and an AI-powered chatbot (using Gemini API) that assists users with suggestions based on their budget. The project includes real‑time validations, data management, and an interactive, polished UI built with React (Vite, TypeScript, Tailwind CSS) on the frontend and Node.js with Express, MySQL, Sequelize, and Zod on the backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup & Data Population](#database-setup--data-population)
  - [Running the Application](#running-the-application)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Usage](#usage)
- [Notes](#notes)

## Features

- **User Authentication:**  
  Secure signup and login system with real‑time validation, error handling, and user-friendly feedback.
  
- **Fantasy Cricket Platform:**  
  Users can draft a team, manage budgets, view player stats, and track performance on a dynamic leaderboard.
  
- **Admin Panel:**  
  Admins can manage player data (CRUD operations), view detailed player stats, and access tournament summaries.
  
- **AI Chatbot (Spiriter):**  
  An AI-powered chatbot provides suggestions on which players to buy based on the user’s current budget and team composition.
  
- **Search, Sort, and Pagination:**  
  Both admin and user interfaces support search functionality, sorting by every column (with ascending/descending toggles), and pagination with adjustable rows per page.
  
- **Role-Based Access Control (RBAC):**  
  Different features and pages are accessible based on the user’s role (user or admin).

## Tech Stack

- **Frontend:**  
  React, Vite, TypeScript, Tailwind CSS, Framer Motion, ReactMarkdown, CountUp

- **Backend:**  
  Node.js, Express, MySQL, Sequelize ORM, Zod (for validation), JWT-based authentication, Gemini API integration via `@google/generative-ai`

## Setup & Installation

### Environment Variables

Create a `.env` file in the **server/** folder with the following keys (update values as needed):

```python

# Database Configuration
DB_NAME=<Your DB Name>
DB_USER=<Your DB User>
DB_PASSWORD=<Your DB Password>
DB_HOST=<Your DB Host>
DB_PORT=<Your DB Port>

# Client URL
CLIENT_URL=<Your Client URL>

# JWT Configuration
JWT_SECRET=<JWT Auth Secret>
JWT_REFRESH_SECRET=<JWT Refresh Secret>

# Google Gemini API Key
GEMINI_API_KEY=<Gemini API Key>

# Server Configuration
PORT=<Server Port>
NODE_ENV=<node environment: "development" or "production">

```

**Note: Please set your backend port to 5000. Unless it won't work.**

For the **client/** folder, create a `.env` file with:

```python

# Base URL for the API
VITE_API_URL=<backend host>

```

### Database Setup & Data Population

1. **Database Preparation:**  
   - Ensure MySQL is installed and running.
   - The server code will automatically check for the existence of the database `secureconnect_spirit11` and create it if it doesn’t exist.
   - Sequelize is configured to sync models with your database (using `sequelize.sync({ alter: true })` in your server's entry file).

2. **Data Population:**  
   - Place CSV files (`players.csv`, `users.csv`, `teams.csv`) in the `server/data/` folder. In this case the CSV files are already provided.
   - On startup, your server will check for these files and populate the database if available. (Refer to your population script.)

```bash
# example admin login credentials
username: admin
password: admin

# example normal user login credentials
username: user
password: user
```

### Running the Application

1. **Install Dependencies:**

   In the **client/** directory:

   ```bash
   npm install
   ```

   In the **server/** directory:

   ```bash
   npm install
   ```

2. **Start the Backend Server:**
   In the **server/** directory, run:

   ```bash
   npm run dev
   ```

   (Or use nodemon if configured.)

3. **Start the Frontend:**
   In the **client/** directory, run:

   ```bash
   npm run dev
   ```

   This will launch the Vite dev server, and you should be able to access the application at [http://localhost:3000](http://localhost:3000).

## Role-Based Access Control (RBAC)

This project implements RBAC with two roles:

- **Admin:**  
  Admins can access the Admin Panel, where they can view, add, edit, and delete players, view tournament summaries, and manage other admin functions. The backend routes for admin are protected by middleware (e.g., `isAdmin`), which checks that `req.user.isAdmin` is true.

- **User:**  
  Regular users can sign up, log in, draft their teams, manage budgets, and use the AI-powered chatbot. The user routes are protected by middleware (e.g., `isUser`), ensuring only non-admins can access those endpoints.

## Usage

- **Authentication:**  
  Users can sign up and log in through dedicated pages. Once authenticated, users receive a session (and tokens via cookies) that allows them to access restricted pages.
  
- **Fantasy Cricket Features:**  
  - **Team Management:**  
    Users can draft players, view their team, and track their remaining budget.
  - **Leaderboard:**  
    Displays player performance metrics with search, sort, and pagination options.
  - **Chatbot:**  
    The AI-powered chatbot (Spiriter) can respond to queries and provide suggestions based on the user's budget.
  
- **Admin Panel:**  
  Admins have an exclusive panel to manage players:
  - **Listing:**  
    View a paginated, searchable, sortable list of players.
  - **CRUD Operations:**  
    Add new players (with a dropdown for category), edit existing players (with read-only fields for computed points and value), and delete players using animated modals.

## Notes

- **Styling & Animations:**  
  The frontend uses Tailwind CSS for styling and Framer Motion for smooth animations (modals, table row transitions, etc.).
  
- **Data Synchronization:**  
  The backend uses Sequelize’s `findAndCountAll` to support pagination, sorting, and filtering.
  
- **Environment:**  
  Ensure your environment variables are correctly set for database, JWT, session, and Gemini API configurations.
  
- **Error Handling:**  
  Both backend and frontend include error handling. Check your console logs if something isn’t working as expected.
