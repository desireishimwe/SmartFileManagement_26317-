import { File } from './file';
import { User } from './user';

export interface Folder {
  id: number;
  folderName: string;
  description?: string;
  createdAt: string;
  files?: File[];
  authorizedUsers?: User[];
  parentFolder?: Folder;
  subFolders?: Folder[];
}

export interface FolderCreateRequest {
  folderName: string;
  description?: string;
  parentFolderId?: number;
}

