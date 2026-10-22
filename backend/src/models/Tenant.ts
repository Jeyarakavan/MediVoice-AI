import { Schema, model, Document, Types } from 'mongoose';

export type TenantStatus = 'active' | 'suspended' | 'pending' | 'deactivated';
export type SubscriptionPlan = 'trial' | 'basic' | 'professional' | 'enterprise';

export interface ITenant extends Document {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  logo?: string;
  website?: string;
  timezone: string;
  status: TenantStatus;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: Date;
  features: string[];
  settings: {
    appointmentDurationMinutes: number;
    maxAdvanceBookingDays: number;
    minBookingNoticeHours: number;
    allowPatientSelfBooking: boolean;
    requireConsentForRecording: boolean;
    emergencyNumber?: string;
    languages: string[];
    currency: string;
  };
  aiReceptionist: {
    enabled: boolean;
    phoneNumber?: string;
    greeting?: string;
    voiceId?: string;
    llmModel?: string;
    fallbackEnabled: boolean;
    fallbackMessage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    logo: { type: String },
    website: { type: String },
    timezone: { type: String, default: 'UTC' },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending', 'deactivated'],
      default: 'pending',
    },
    subscriptionPlan: {
      type: String,
      enum: ['trial', 'basic', 'professional', 'enterprise'],
      default: 'trial',
    },
    subscriptionExpiresAt: Date,
    features: [{ type: String }],
    settings: {
      appointmentDurationMinutes: { type: Number, default: 30 },
      maxAdvanceBookingDays: { type: Number, default: 60 },
      minBookingNoticeHours: { type: Number, default: 2 },
      allowPatientSelfBooking: { type: Boolean, default: false },
      requireConsentForRecording: { type: Boolean, default: true },
      emergencyNumber: String,
      languages: { type: [String], default: ['en'] },
      currency: { type: String, default: 'USD' },
    },
    aiReceptionist: {
      enabled: { type: Boolean, default: false },
      phoneNumber: String,
      greeting: String,
      voiceId: String,
      llmModel: String,
      fallbackEnabled: { type: Boolean, default: true },
      fallbackMessage: String,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

tenantSchema.index({ slug: 1 });
tenantSchema.index({ status: 1 });

export const Tenant = model<ITenant>('Tenant', tenantSchema);
