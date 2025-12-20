import { User } from './user';
import { Folder } from './folder';

export interface File {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: string;
  modifiedAt: string;
  user?: User;
  folder?: Folder;
  description?: string;
}

export interface FileUploadRequest {
  file: File | Blob;
  folderId: number;
  userId: number;
}

