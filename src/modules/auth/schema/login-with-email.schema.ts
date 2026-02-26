import z from 'zod';

export const loginWithEmailSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});
