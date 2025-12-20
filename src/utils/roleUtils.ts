import { UserRole } from '../types/user';

export const isAdmin = (role?: UserRole) => role === UserRole.ADMIN;
export const isStudent = (role?: UserRole) => role === UserRole.STUDENT;

export const getRoleDisplayName = (role: UserRole | undefined): string => {
  if (!role) return 'Unknown';
  if (role === UserRole.ADMIN) return 'Admin';
  if (role === UserRole.STAFF) return 'Staff';
  return 'Student';
};
