export type RegisterWithEmailResponseDto = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
};
