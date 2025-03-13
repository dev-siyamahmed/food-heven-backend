import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  bcrypt_salt_round: process.env.BCRYPT_SOLT_ROUND,
  jwt_access_secret_key: process.env.JWT_ACCESS_SECRET_KEY,
  jwt_access_expires_in: process.env.JWT_ACCESS_SECRET_KEY_IN,
};
