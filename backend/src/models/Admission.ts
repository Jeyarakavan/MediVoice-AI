import { Schema, model, Document, Types } from 'mongoose';

export type AdmissionStatus = 'admitted' | 'discharged' | 'transferred' | 'cancelled';

export interface IAdmission extends Document {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  ward?: string;
  bedNumber?: string;
  admissionDate: Date;
  expectedDischargeDate?: Date;
  actualDischargeDate?: Date;
  admissionReason: string;
  dischargeSummary?: string;
  status: AdmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const admissionSchema = new Schema<IAdmission>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    ward: String,
    bedNumber: String,
    admissionDate: { type: Date, required: true },
    expectedDischargeDate: Date,
    actualDischargeDate: Date,
    admissionReason: { type: String, required: true },
    dischargeSummary: String,
    status: {
      type: String,
      enum: ['admitted', 'discharged', 'transferred', 'cancelled'],
      default: 'admitted',
    },
  },
  { timestamps: true }
);

admissionSchema.index({ tenantId: 1, patientId: 1, status: 1 });

export const Admission = model<IAdmission>('Admission', admissionSchema);
