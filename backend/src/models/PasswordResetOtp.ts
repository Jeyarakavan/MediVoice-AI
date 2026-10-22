import { Schema, model, Document, Types } from 'mongoose';

export interface IPasswordResetOtp extends Document {
  userId: Types.ObjectId;
  email: string;
  otpHash: string;              // argon2/bcrypt hash of 6-digit OTP
  expiresAt: Date;
  attempts: number;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetOtpSchema = new Schema<IPasswordResetOtp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, lowercase: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-expire documents via MongoDB TTL index (60 seconds after expiresAt)
passwordResetOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });
passwordResetOtpSchema.index({ userId: 1 });

export const PasswordResetOtp = model<IPasswordResetOtp>('PasswordResetOtp', passwordResetOtpSchema);
