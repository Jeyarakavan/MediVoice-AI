import { Schema, model, Document, Types } from 'mongoose';

export interface IDepartment extends Document {
  tenantId: Types.ObjectId;
  name: string;
  description?: string;
  headDoctorId?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,
    headDoctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

departmentSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export const Department = model<IDepartment>('Department', departmentSchema);
