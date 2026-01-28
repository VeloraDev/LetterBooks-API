import type z from 'zod';
import type { loginWithEmailSchema } from '../schema/login-with-email.schema.js';

export type LoginWithEmailDto = z.infer<typeof loginWithEmailSchema>;
