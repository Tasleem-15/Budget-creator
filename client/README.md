# Budget Creator

A full-stack web app for freelancers to manage clients and projects,
build budgets, and export them as PDFs.

## Features
- Register and login (JWT authentication)
- Manage clients and projects
- Budget items with automatic totals
- Export a budget as a PDF
- Dashboard with earnings and project statistics

## Tech stack
React, Node.js, Express, PostgreSQL, JWT, bcrypt, jsPDF, Recharts

## How to run

1. Create a PostgreSQL database and run `server/schema.sql`
2. In `server`, copy `.env.example` to `.env` and fill in your values
3. In `server`: `npm install` then `node index.js`
4. In `client`: `npm install` then `npm run dev`
