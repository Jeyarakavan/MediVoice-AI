import { Schema, model, Document, Types } from 'mongoose';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface IDoctorLeave extends Document {
  tenantId: Types.ObjectId;
  doctorId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const doctorLeaveSchema = new Schema<IDoctorLeave>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

doctorLeaveSchema.index({ tenantId: 1, doctorId: 1, startDate: 1, endDate: 1 });
doctorLeaveSchema.index({ tenantId: 1, doctorId: 1, status: 1 });

export const DoctorLeave = model<IDoctorLeave>('DoctorLeave', doctorLeaveSchema);
