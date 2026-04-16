import z from 'zod';

export const listUsersSchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  cursor: z.string().optional(),
  username: z.string().optional(),
});
