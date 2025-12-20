# Smart File Management System - Frontend

A modern React frontend application for the Smart File Management System.

## Features

- **Authentication**: Login, Signup, Password Reset, Two-Factor Authentication
- **Dashboard**: Overview with statistics and recent activity
- **File Management**: Upload, view, search, and manage files
- **Folder Management**: Create and organize folders
- **User Management**: View and manage users (Admin/Staff only)
- **Location Management**: Hierarchical location structure
- **Role-Based Access Control**: Admin, Staff, and Student roles
- **Global Search**: Search across all entities
- **Pagination**: All list pages support pagination
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI) v5
- React Router v6
- Axios
- React Hook Form + Zod
- Vite

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:8081/api
```

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client functions
│   ├── components/    # React components
│   ├── contexts/      # React contexts (Auth, Theme)
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
```

## Backend Requirements

The frontend expects the following backend endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/verify-2fa`
- `GET /api/auth/me`

### Dashboard
- `GET /api/dashboard/stats`

### Search
- `GET /api/search?q={query}`

See the plan document for complete API requirements.

