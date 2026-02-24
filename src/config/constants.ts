function requireEnv(name: string, value?: string) {
  if (!value) throw new Error(`Environment variable ${name} is not defined`);
  return value;
}

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = requireEnv('JWT_SECRET', process.env.JWT_SECRET);
export const DATABASE_URL = requireEnv(
  'DATABASE_URL',
  process.env.DATABASE_URL,
);
