import z from 'zod';

export const registerWithEmailSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._-]+$/, 'Invalid username')
    .min(3)
    .max(30),
  email: z.email(),
  password: z.string().min(8).max(100),
});
