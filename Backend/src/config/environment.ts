import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface Config {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiry: string;
  frontendUrl: string;
  razorpay: {
    keyId: string;
    keySecret: string;
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
};

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is required');
}

export default config;
