export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

import { File } from './file';
import { User } from './user';
import { Folder } from './folder';
import { Location } from './location';


export interface ApiError {
  message: string;
  status: number;
}

export interface DashboardStats {
  totalFiles: number;
  totalUsers: number;
  totalFolders: number;
  totalLocations: number;
  totalSize: number;
  fileTypeDistribution: Record<string, number>;
  recentFiles: File[];
  recentUsers: User[];
  recentActivity?: AuditLog[];
}

export interface SearchResult {
  files: File[];
  folders: Folder[];
  users: User[];
  locations: Location[];
}

export interface AuditLog {
  id: number;
  action: string;
  userEmail?: string;
  userId?: number;
  resourceType?: string;
  resourceId?: number;
  details?: string;
  createdAt: string;
}

