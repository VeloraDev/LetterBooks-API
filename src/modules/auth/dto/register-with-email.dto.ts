import type z from 'zod';
import type { registerWithEmailSchema } from '../schema/register-with-email.schema.js';

export type RegisterWithEmailDto = z.infer<typeof registerWithEmailSchema>;
