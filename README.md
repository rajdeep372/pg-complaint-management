# PG Complaint Management System

A full-stack modern web application for managing Paying Guest (PG) accommodations, staff, tenants, and complaints. Built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features & Application Flow
This system is designed with Role-Based Access Control (RBAC) supporting three primary user flows:

1. **Owner**: Can register and create a PG Account. They can invite Editors (staff) and add Tenants. Owners have full visibility over all complaints, can update complaint statuses, and can edit PG account settings.
2. **Editor**: Invited by the Owner. Upon first login, Editors are presented with a mandatory "Accept Invite" prompt. Once accepted, they can add Tenants, register complaints for Tenants, and resolve complaints. They cannot manage staff or edit the core PG settings.
3. **Tenant**: Added by an Owner or Editor. Tenants can log in to view their PG details, register new complaints, and track the status of their complaints.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router v6, Context API, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express.js, Mongoose, JWT authentication, bcryptjs.
- **Database**: MongoDB (Atlas).

## Local Setup Steps

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB account (Default URI is provided for immediate testing)

### 2. Installation
Clone the repository, then install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory. (Note: Fallback values are included in the code for immediate testing without a .env file).

```env
PORT=5000
MONGO_URI=mongodb+srv://bca2023035_db_user:qX3A5drCROMhJn6I@cluster0.e5qmeip.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Running the Application
You can run both servers manually in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev   # Uses nodemon to automatically restart on changes
# OR
npm start     # Runs standard node server
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The frontend will be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

## API Endpoints Summary

### Auth (`/api/auth`)
- `POST /register`: Register Owner.
- `POST /login`: Authenticate users & get token.
- `PUT /accept-invite`: (Editor) Accept pending invitation.
- `GET /me`: Get current logged-in user.

### PG Account (`/api/pg`)
- `POST /`: (Owner) Create PG Account.
- `GET /`: Get PG Account details.
- `PUT /`: (Owner) Update PG Account.

### Users (`/api/users`)
- `GET /`: (Owner/Editor) Get all staff and tenants in the PG.
- `POST /editor`: (Owner) Invite a new Editor.
- `POST /tenant`: (Owner/Editor) Add a new Tenant.

### Complaints (`/api/complaints`)
- `POST /`: (All) Create a new complaint.
- `GET /`: (All) Get complaints (Tenants see own, Owners/Editors see all).
- `PUT /:id`: (Owner/Editor) Update complaint status.

## Deployment Notes
- **Frontend**: Includes a `vercel.json` file for client-side routing rewrites (`/* -> /index.html`). Can be deployed on Vercel seamlessly.
- **Backend**: Can be deployed on Render, Heroku, or Vercel Serverless. Make sure to set the `MONGO_URI` and `JWT_SECRET` in your host's environment variables.
