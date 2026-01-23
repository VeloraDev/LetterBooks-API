import { z, ZodType } from 'zod';
import { ApiError } from '../errors/api.error.js';

export function validate<T extends ZodType>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError(400, 'Invalid data', z.treeifyError(result.error));
  }

  return result.data;
}
