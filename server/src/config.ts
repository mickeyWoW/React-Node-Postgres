import assert from 'assert';

const jwtSecret = process.env.JWT_SECRET;
assert(jwtSecret);

const databaseUrl = process.env.DATABASE_URL;
assert(databaseUrl);

const nodeEnv = process.env.NODE_ENV || 'development';

export default {
  openEmailsInDev: process.env.OPEN_EMAILS_IN_DEV === 'true',
  jwtSecret,
  databaseUrl,
  env: {
    production: nodeEnv === 'production',
    development: nodeEnv === 'development',
    test: nodeEnv === 'test',
  },
};
