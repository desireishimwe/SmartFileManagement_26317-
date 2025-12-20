export interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department?: string;
  email?: string;
  phone?: string;
}

export interface StudentFolder {
  id: number;
  studentId: string;
  studentName: string;
  folderName: string; // Format: "{studentId} - {fullName}"
  createdAt: string;
  files?: StudentFile[];
  categories?: CategoryFolder[];
}

export interface CategoryFolder {
  id: number;
  categoryName: 'registration' | 'financial' | 'academic' | 'disciplinary';
  displayName: string;
  files?: StudentFile[];
}

export interface StudentFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  category: string;
  uploadedAt: string;
  modifiedAt: string;
  uploadedBy?: string;
}

export const DOCUMENT_CATEGORIES = [
  { value: 'registration', label: 'Registration' },
  { value: 'financial', label: 'Financial' },
  { value: 'academic', label: 'Academic' },
  { value: 'disciplinary', label: 'Disciplinary' },
] as const;


