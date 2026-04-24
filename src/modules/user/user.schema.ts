import z from 'zod';
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9._-]+$/, 'Invalid username')
  .min(3)
  .max(30);

export const listUsersSchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  cursor: z.string().optional(),
  username: z.string().optional(),
});

export const createUserSchema = z.object({
  username: usernameSchema,
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    username: usernameSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided',
  });

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
