import z from 'zod';
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9._-]+$/, 'Invalid username')
  .min(3)
  .max(30);

const userSort = ['newest', 'username'] as const;
export type UserSortBy = (typeof userSort)[number];

export const listUsersSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(1).default(1),
  username: z.string().optional(),
  sortBy: z.enum(userSort).optional().default('newest'),
});

export type ListUsersDto = z.infer<typeof listUsersSchema>;

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
