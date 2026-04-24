import z from 'zod';

export const loginWithEmailSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type LoginWithEmailDto = z.infer<typeof loginWithEmailSchema>;

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

export type RegisterWithEmailDto = z.infer<typeof registerWithEmailSchema>;
