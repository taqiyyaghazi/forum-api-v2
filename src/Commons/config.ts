import dotenv from 'dotenv';
import path from 'path';
import { PoolConfig } from 'pg';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.test'),
  });
} else {
  dotenv.config();
}

interface AppConfig {
  host: string;
  port: number;
  debug: { request: string[] } | Record<string, never>;
}

interface DatabaseConfig extends PoolConfig {
  host: string | undefined;
  port: number | undefined;
  user: string | undefined;
  password: string | undefined;
  database: string | undefined;
}

interface AuthConfig {
  jwtStrategy: string;
  accessTokenKey: string | undefined;
  refreshTokenKey: string | undefined;
  accessTokenAge: string | undefined;
}

interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
}

const config: Config = {
  app: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: Number(process.env.PORT || 5000),
    debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : {},
  },
  database: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  auth: {
    jwtStrategy: 'forumapi',
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
};

export default config;
