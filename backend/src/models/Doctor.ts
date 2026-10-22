import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  departmentId?: Types.ObjectId;
  employeeId?: string;
  specialty: string;
  qualifications: string[];
  registrationNumber?: string;
  appointmentDurationMinutes: number;
  consultationFee?: number;
  bio?: string;
  languages: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    employeeId: String,
    specialty: { type: String, required: true, trim: true },
    qualifications: [String],
    registrationNumber: String,
    appointmentDurationMinutes: { type: Number, default: 30 },
    consultationFee: Number,
    bio: String,
    languages: { type: [String], default: ['en'] },
    isActive: { type: Boolean, default: true },
    deletedAt: Date,
  },
  { timestamps: true }
);

doctorSchema.index({ tenantId: 1, specialty: 1 });
doctorSchema.index({ tenantId: 1, departmentId: 1 });
doctorSchema.index({ tenantId: 1, isActive: 1 });

export const Doctor = model<IDoctor>('Doctor', doctorSchema);
