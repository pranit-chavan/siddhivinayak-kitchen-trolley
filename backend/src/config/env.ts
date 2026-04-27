type Environment = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  PORT: string;
};

export function validateEnv(config: Record<string, unknown>): Environment {
  const requiredKeys = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
  ] as const;

  const missingKeys = requiredKeys.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingKeys.join(', ')}`,
    );
  }

  return {
    DATABASE_URL: String(config.DATABASE_URL),
    JWT_SECRET: String(config.JWT_SECRET),
    JWT_EXPIRES_IN: String(config.JWT_EXPIRES_IN),
    PORT: String(config.PORT ?? '4000'),
  };
}
