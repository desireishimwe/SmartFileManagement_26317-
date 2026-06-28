# High School Management System Frontend

Modern responsive school management dashboard built with React, Vite, Bootstrap 5, React Router DOM, Axios, React Icons, Chart.js, and Context API.

## Features

- Authentication pages with validation and school branding
- Dashboard summary cards, charts, recent activity, and quick actions
- Student management with add, edit, delete, detail view, search, class filter, and pagination
- Teacher management with add, edit, delete, and search
- Class, attendance, results, fee, timetable, and reports modules
- Mock JSON data for students, teachers, classes, attendance, results, and payments
- Toast notifications, loading spinner, responsive sidebar, and reusable tables/cards

## Setup

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── Navbar/
│   ├── Sidebar/
│   ├── Footer/
│   ├── Cards/
│   └── Tables/
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Students/
│   ├── Teachers/
│   ├── Classes/
│   ├── Attendance/
│   ├── Results/
│   ├── Fees/
│   ├── Timetable/
│   └── Reports/
├── services/
├── routes/
├── context/
├── layouts/
├── App.tsx
└── main.tsx
```

## Notes

The current app uses mock data and frontend state so every page is immediately usable. Replace `src/services/api.ts` and the context actions with backend calls when the school API is available.
