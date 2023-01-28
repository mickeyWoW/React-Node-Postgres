const { config } = require('dotenv');
config();

module.exports = {
  type: 'postgres',
  url:
    process.env.NODE_ENV === 'test'
      ? process.env.DATABASE_URL_TEST
      : process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL !== 'false',
  extra: {
    ssl: process.env.DATABASE_SSL !== 'false' && {
      rejectUnauthorized: false,
    },
    max: process.env.DATABASE_MAX_CONNECTIONS || 5,
  },
  synchronize: false,
  logging: process.env.NODE_ENV !== 'test',
  entities: [
    process.env.NODE_ENV === 'production'
      ? 'build/src/**/*.model.js'
      : 'src/**/*.model.ts',
  ],
};
