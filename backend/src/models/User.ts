import { Schema, model, Document, Types } from 'mongoose';

export type UserRole = 'superAdmin' | 'hospitalAdmin' | 'receptionist' | 'doctor' | 'patient';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'locked';

export interface IUser extends Document {
  tenantId?: Types.ObjectId;          // null for superAdmin
  role: UserRole;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  isEmailVerified: boolean;
  activationToken?: string;
  activationTokenExpiresAt?: Date;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    role: {
      type: String,
      enum: ['superAdmin', 'hospitalAdmin', 'receptionist', 'doctor', 'patient'],
      required: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: String,
    avatar: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'locked'],
      default: 'pending',
    },
    isEmailVerified: { type: Boolean, default: false },
    activationToken: String,
    activationTokenExpiresAt: Date,
    lastLoginAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    refreshTokenHash: String,
    deletedAt: Date,
  },
  { timestamps: true }
);

// Global email uniqueness per tenant (superAdmin emails are globally unique)
userSchema.index({ email: 1, tenantId: 1 }, { unique: true });
userSchema.index({ tenantId: 1, role: 1 });
userSchema.index({ tenantId: 1, status: 1 });

export const User = model<IUser>('User', userSchema);
