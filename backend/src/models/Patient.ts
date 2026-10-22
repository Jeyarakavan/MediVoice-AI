import { Schema, model, Document, Types } from 'mongoose';

export interface IPatient extends Document {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;             // linked User account
  patientId: string;                  // human-readable e.g. MV-000001
  nic?: string;                       // encrypted/hashed at rest — never log raw
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bloodGroup?: string;
  phone: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  allergies: string[];
  chronicConditions: string[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  consentRecording: boolean;
  consentDataRetention: boolean;
  registrationSource: 'web' | 'phone' | 'ai_call' | 'manual';
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patientId: { type: String, required: true },
    nic: { type: String },                // store hashed; search by hash
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    bloodGroup: String,
    phone: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    allergies: [String],
    chronicConditions: [String],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },
    consentRecording: { type: Boolean, default: false },
    consentDataRetention: { type: Boolean, default: true },
    registrationSource: {
      type: String,
      enum: ['web', 'phone', 'ai_call', 'manual'],
      default: 'manual',
    },
    isActive: { type: Boolean, default: true },
    notes: String,
    deletedAt: Date,
  },
  { timestamps: true }
);

patientSchema.index({ tenantId: 1, patientId: 1 }, { unique: true });
patientSchema.index({ tenantId: 1, nic: 1 });          // nic stored as hash
patientSchema.index({ tenantId: 1, phone: 1 });
patientSchema.index({ tenantId: 1, isActive: 1 });

export const Patient = model<IPatient>('Patient', patientSchema);
