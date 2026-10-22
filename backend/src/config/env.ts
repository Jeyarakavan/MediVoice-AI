import dotenv from 'dotenv';
import path from 'path';

// Load .env before anything else
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const config = {
  env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  port: parseInt(process.env.PORT || '5000', 10),

  // MongoDB — only read, never expose
  mongoUri: requireEnv('MONGODB_URI'),

  // JWT
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Email
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@medivoice.ai',
  },

  // Twilio
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    twimlAppSid: process.env.TWILIO_TWIML_APP_SID || '',
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || '',
  },

  // AI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  },
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || '',
    voiceId: process.env.ELEVENLABS_VOICE_ID || '',
  },

  // File uploads
  upload: {
    dir: process.env.LOCAL_UPLOAD_DIR || './uploads',
    maxSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10),
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
  },

  // OTP
  otp: {
    expiresMinutes: parseInt(process.env.OTP_EXPIRES_MINUTES || '10', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
  },
} as const;
