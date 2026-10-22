import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  loginUser,
  generatePasswordResetOtp,
  verifyAndResetPassword,
  refreshAccessToken,
} from '../services/authService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// ─── Validation schemas ────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8).max(128),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

// ─── POST /auth/login ──────────────────────────────────────────────────────

router.post('/login', async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: 'Invalid request', errors: parse.error.errors });
    return;
  }

  const { email, password } = parse.data;
  const result = await loginUser(
    email,
    password,
    req.ip,
    req.headers['user-agent']
  );

  res.json({ success: true, data: result });
});

// ─── POST /auth/refresh ────────────────────────────────────────────────────

router.post('/refresh', async (req: Request, res: Response) => {
  const parse = refreshSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: 'Invalid request' });
    return;
  }

  const tokens = await refreshAccessToken(parse.data.refreshToken);
  res.json({ success: true, data: tokens });
});

// ─── POST /auth/forgot-password ───────────────────────────────────────────

router.post('/forgot-password', async (req: Request, res: Response) => {
  const parse = forgotSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: 'Invalid email' });
    return;
  }

  // Always succeed generically — don't reveal account existence
  await generatePasswordResetOtp(parse.data.email);
  res.json({
    success: true,
    message: 'If an account with that email exists, a reset code has been sent.',
  });
});

// ─── POST /auth/reset-password ────────────────────────────────────────────

router.post('/reset-password', async (req: Request, res: Response) => {
  const parse = resetSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: 'Invalid request', errors: parse.error.errors });
    return;
  }

  const { email, otp, newPassword } = parse.data;
  await verifyAndResetPassword(email, otp, newPassword);
  res.json({ success: true, message: 'Password has been updated successfully.' });
});

// ─── GET /auth/me ──────────────────────────────────────────────────────────

router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: req.user });
});

// ─── POST /auth/logout ─────────────────────────────────────────────────────

router.post('/logout', authenticate, (req: AuthRequest, res: Response) => {
  // Client should discard tokens; server can optionally revoke refresh token here
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
