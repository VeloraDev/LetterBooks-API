import z from 'zod';

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._-]+$/, 'Invalid username')
    .min(3)
    .max(30),
  bio: z.string().max(300).optional(),
});
export type CreateUserDto = z.infer<typeof createUserSchema>;
