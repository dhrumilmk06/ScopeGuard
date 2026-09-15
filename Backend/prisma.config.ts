import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default defineConfig({
  earlyAccess: true,
  migrations: {
    url: process.env.DATABASE_URL
  }
});
