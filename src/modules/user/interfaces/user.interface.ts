export interface User {
  id: string;
  username: string;
  bio: string | null;
  profileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
