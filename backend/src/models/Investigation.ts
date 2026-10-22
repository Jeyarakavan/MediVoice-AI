import { Schema, model, Document, Types } from 'mongoose';

export type InvestigationStatus = 'requested' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';

export interface IInvestigation extends Document {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  type: 'lab' | 'scan' | 'other';
  name: string;
  instructions?: string;
  status: InvestigationStatus;
  resultSummary?: string;
  resultDocumentIds: Types.ObjectId[];
  requestedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const investigationSchema = new Schema<IInvestigation>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    type: { type: String, enum: ['lab', 'scan', 'other'], required: true },
    name: { type: String, required: true },
    instructions: String,
    status: {
      type: String,
      enum: ['requested', 'sample_collected', 'processing', 'completed', 'cancelled'],
      default: 'requested',
    },
    resultSummary: String,
    resultDocumentIds: [{ type: Schema.Types.ObjectId, ref: 'MedicalDocument' }],
    requestedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true }
);

investigationSchema.index({ tenantId: 1, patientId: 1 });

export const Investigation = model<IInvestigation>('Investigation', investigationSchema);
