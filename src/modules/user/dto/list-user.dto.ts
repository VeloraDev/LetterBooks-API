import z from 'zod';

const userSort = ['newest', 'username'] as const;
export type UserSortBy = (typeof userSort)[number];

export const listUsersSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(1).default(1),
  username: z.string().optional(),
  sortBy: z.enum(userSort).optional().default('newest'),
});
export type ListUsersDto = z.infer<typeof listUsersSchema>;
