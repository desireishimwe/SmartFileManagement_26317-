export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export const PAGE_SIZES = [5, 10, 20, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  FILES: '/files',
  FILE_DETAIL: '/files/:id',
  REPORTS: '/reports',
  FOLDERS: '/folders',
  USERS: '/users',
  LOCATIONS: '/locations',
  MY_PROFILE: '/my-profile',
  AUDIT: '/audit',
} as const;

