# Budget Creator

A full-stack web app that lets freelancers manage clients and projects, build
budgets with line items, export them as PDFs, and track earnings on a dashboard.

## Features

- **Authentication:** register and login with hashed passwords and JWT tokens
- **Private data:** every user sees only their own clients, projects and budgets
- **Clients:** add, edit and delete clients
- **Projects:** link each project to a client, with a status (draft, active, completed)
- **Budgets:** add, edit and delete line items, with automatic line totals and a project total
- **PDF export:** download any budget as a PDF
- **Dashboard:** total clients, projects and earnings, projects by status, and earnings over time

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React (Vite), React Router, Recharts, jsPDF |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT, bcryptjs |
| Styling | Plain CSS |

## How it works

```
React (browser)  →  Express API  →  PostgreSQL
```

React sends requests with the user's token. The Express server checks the token
with a middleware, then runs SQL queries that are filtered by the logged-in user.

Database structure:

```
users → clients → projects → budget_items
```

## Project structure

```
budget-creator/
├── client/                 React frontend
│   └── src/
│       ├── pages/          Dashboard, Clients, Projects, BudgetEditor, Login, Register
│       ├── utils/          PDF export
│       ├── api.js          all calls to the server
│       └── AuthContext.jsx login state shared across the app
└── server/                 Express backend
    ├── routes/             auth, clients, projects, budgets, dashboard
    ├── middleware/         JWT check
    ├── db.js               PostgreSQL connection
    ├── schema.sql          table definitions
    └── index.js            server entry point
```

## API overview

| Method | Route | What it does |
|---|---|---|
| POST | /api/auth/register | create an account |
| POST | /api/auth/login | log in and get a token |
| GET, POST, PUT, DELETE | /api/clients | manage clients |
| GET, POST, PUT, DELETE | /api/projects | manage projects |
| GET, POST, PUT, DELETE | /api/budgets | manage budget items |
| GET | /api/dashboard | dashboard statistics |

All routes except `/api/auth` need a valid token.

## Getting started

**Requirements:** Node.js and PostgreSQL

1. Clone the project

   ```bash
   git clone https://github.com/Tasleem-15/Budget-creator.git
   cd Budget-creator
   ```

2. Create the database and tables

   ```bash
   psql -U postgres -c "CREATE DATABASE budget_creator;"
   psql -U postgres -d budget_creator -f server/schema.sql
   ```

3. Set up the server

   ```bash
   cd server
   npm install
   ```

   Copy `.env.example` to a new file named `.env`, then fill in your own
   database password, database name and a long random `JWT_SECRET`.

   ```bash
   node index.js
   ```

4. Set up the client (in a second terminal)

   ```bash
   cd client
   npm install
   npm run dev
   ```

5. Open the link that Vite prints (usually http://localhost:5173)

## What I learned

- Building a REST API with Express and PostgreSQL
- Password hashing and JWT authentication
- Protecting routes in both the frontend and the backend
- Using SQL joins and aggregate functions for dashboard data
- Managing state in React with hooks and context