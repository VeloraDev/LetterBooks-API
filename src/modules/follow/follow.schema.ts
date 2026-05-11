import z from 'zod';

export const idSchema = z.cuid2();

const followSort = ['newest', 'oldest'] as const;
export type FollowSortBy = (typeof followSort)[number];

export const listFollowsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(1).default(1),
  username: z.string().optional(),
  sortBy: z.enum(followSort).optional().default('newest'),
});

export type ListFollowsDto = z.infer<typeof listFollowsSchema>;
