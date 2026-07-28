import z from 'zod';
import { createUserSchema } from './create-user.dto.js';

export const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided',
  });

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
