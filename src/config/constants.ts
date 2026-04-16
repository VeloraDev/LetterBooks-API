function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} is not defined`);
  return value;
}

export function getPort() {
  return process.env.PORT || 3000;
}

export function getDatabaseUrl() {
  return requireEnv('DATABASE_URL');
}

export function getJwtSecret() {
  return requireEnv('JWT_SECRET');
}

export function getCsfrSecret() {
  return requireEnv('CSFR_SECRET');
}
