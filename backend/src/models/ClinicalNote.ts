import { Schema, model, Document, Types } from 'mongoose';

export interface IClinicalNote extends Document {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  examination?: string;
  assessment?: string;
  plan?: string;
  followUpDate?: Date;
  followUpInstructions?: string;
  isSigned: boolean;
  signedAt?: Date;
  versions: {
    versionNumber: number;
    editedAt: Date;
    editedBy: Types.ObjectId;
    snapshot: Record<string, unknown>;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const clinicalNoteSchema = new Schema<IClinicalNote>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    chiefComplaint: String,
    historyOfPresentIllness: String,
    examination: String,
    assessment: String,
    plan: String,
    followUpDate: Date,
    followUpInstructions: String,
    isSigned: { type: Boolean, default: false },
    signedAt: Date,
    versions: [
      {
        versionNumber: Number,
        editedAt: Date,
        editedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        snapshot: Schema.Types.Mixed,
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

clinicalNoteSchema.index({ tenantId: 1, patientId: 1 });
clinicalNoteSchema.index({ tenantId: 1, doctorId: 1 });
clinicalNoteSchema.index({ tenantId: 1, appointmentId: 1 });

export const ClinicalNote = model<IClinicalNote>('ClinicalNote', clinicalNoteSchema);
