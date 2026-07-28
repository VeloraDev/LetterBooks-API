import { createUserSchema } from 'src/modules/user/dto/create-user.dto.js';
import z from 'zod';

export const registerWithEmailSchema = createUserSchema.extend({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type RegisterWithEmailDto = z.infer<typeof registerWithEmailSchema>;
