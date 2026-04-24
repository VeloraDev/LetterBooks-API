import z from 'zod';
import { usernameSchema } from '../user/user.schema.js';

export const loginWithEmailSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type LoginWithEmailDto = z.infer<typeof loginWithEmailSchema>;

export const registerWithEmailSchema = z.object({
  username: usernameSchema,
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type RegisterWithEmailDto = z.infer<typeof registerWithEmailSchema>;
