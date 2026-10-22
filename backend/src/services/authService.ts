import argon2 from 'argon2';
import crypto from 'crypto';
import { User, IUser } from '../models/User';
import { PasswordResetOtp } from '../models/PasswordResetOtp';
import { AuditLog } from '../models/AuditLog';
import { generateTokens, verifyRefreshToken } from '../middleware/auth';
import { config } from '../config/env';
import { createError } from '../middleware/errorHandler';
import { Types } from 'mongoose';

// ─── Password Hashing ────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
) {
  // Search by email — note: email is unique per tenantId compound index
  const user = await User.findOne({ email: email.toLowerCase() });

  const logAttempt = async (result: 'success' | 'failure', userId?: Types.ObjectId) => {
    await AuditLog.create({
      tenantId: user?.tenantId,
      actorId: userId,
      actorRole: user?.role,
      action: result === 'success' ? 'user.login' : 'user.login_failed',
      ipAddress,
      userAgent,
      result,
    });
  };

  if (!user || user.status === 'inactive' || user.deletedAt) {
    // Consistent timing to avoid user enumeration
    await argon2.hash('dummy_timing_protection');
    await logAttempt('failure');
    throw createError('Invalid credentials', 401);
  }

  // Check lock
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw createError('Account is temporarily locked. Please try again later.', 429);
  }

  const valid = await verifyPassword(user.passwordHash, password);

  if (!valid) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      user.status = 'locked';
    }
    await user.save();
    await logAttempt('failure', user._id as Types.ObjectId);
    throw createError('Invalid credentials', 401);
  }

  // Successful login
  user.loginAttempts = 0;
  user.lockedUntil = undefined;
  if (user.status === 'locked') user.status = 'active';
  user.lastLoginAt = new Date();
  await user.save();
  await logAttempt('success', user._id as Types.ObjectId);

  const payload = {
    userId: (user._id as Types.ObjectId).toString(),
    role: user.role,
    tenantId: user.tenantId?.toString(),
  };

  return {
    tokens: generateTokens(payload),
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
}

// ─── OTP Password Reset ───────────────────────────────────────────────────────

export async function generatePasswordResetOtp(email: string): Promise<string> {
  // Always respond generically — don't reveal if account exists
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return 'ok'; // silently succeed

  // Invalidate previous OTPs
  await PasswordResetOtp.deleteMany({ userId: user._id });

  const otp = crypto.randomInt(100_000, 999_999).toString();
  const otpHash = await hashPassword(otp);
  const expiresAt = new Date(Date.now() + config.otp.expiresMinutes * 60 * 1000);

  await PasswordResetOtp.create({
    userId: user._id,
    email: user.email,
    otpHash,
    expiresAt,
  });

  // Return the raw OTP so the caller (email service) can send it
  return otp;
}

export async function verifyAndResetPassword(
  email: string,
  otp: string,
  newPassword: string
): Promise<void> {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw createError('Invalid or expired OTP', 400);

  const record = await PasswordResetOtp.findOne({
    userId: user._id,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!record) throw createError('Invalid or expired OTP', 400);

  if (record.attempts >= config.otp.maxAttempts) {
    await PasswordResetOtp.deleteOne({ _id: record._id });
    throw createError('Too many OTP attempts. Please request a new code.', 429);
  }

  const valid = await verifyPassword(record.otpHash, otp);

  if (!valid) {
    record.attempts += 1;
    await record.save();
    throw createError('Invalid or expired OTP', 400);
  }

  // Mark used and update password
  record.isUsed = true;
  await record.save();

  user.passwordHash = await hashPassword(newPassword);
  user.loginAttempts = 0;
  user.lockedUntil = undefined;
  user.status = 'active';
  await user.save();

  await AuditLog.create({
    tenantId: user.tenantId,
    actorId: user._id,
    action: 'user.password_reset',
    result: 'success',
  });
}

// ─── Refresh Tokens ───────────────────────────────────────────────────────────

export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);
    if (!user || user.status !== 'active') {
      throw createError('Invalid refresh token', 401);
    }

    const newPayload = {
      userId: (user._id as Types.ObjectId).toString(),
      role: user.role,
      tenantId: user.tenantId?.toString(),
    };

    return generateTokens(newPayload);
  } catch {
    throw createError('Invalid or expired refresh token', 401);
  }
}
