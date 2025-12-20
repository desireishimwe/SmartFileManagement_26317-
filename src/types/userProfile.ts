import { User } from './user';

export interface UserProfile {
  id: number;
  profilePicture?: string;
  bio?: string;
  preferences?: string;
  user: User;
}

