import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User, IUser } from '../models/User';
import { Types } from 'mongoose';

export interface AuthPayload {
  userId: string;
  role: string;
  tenantId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function generateTokens(payload: AuthPayload) {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(token, config.jwt.secret) as AuthPayload;
}

export function verifyRefreshToken(token: string): AuthPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as AuthPayload;
}

/**
 * Middleware: verify JWT access token from Authorization header.
 */
export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const token = header.slice(7);
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * Middleware factory: restrict to specific roles.
 */
export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}

/**
 * Middleware: enforce that the requesting user belongs to the tenant in params/query.
 * superAdmin bypasses this check.
 */
export function enforceTenant(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  if (req.user.role === 'superAdmin') {
    next();
    return;
  }

  const paramTenantId = req.params.tenantId || req.query.tenantId as string;
  if (paramTenantId && req.user.tenantId !== paramTenantId) {
    res.status(403).json({ success: false, message: 'Access to this tenant is not permitted' });
    return;
  }
  next();
}
