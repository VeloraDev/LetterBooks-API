import z from 'zod';

export const listUsersSchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  cursor: z.string().optional(),
  username: z.string().optional(),
});

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9._-]+$/, 'Invalid username')
      .min(3)
      .max(30),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided',
  });

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
