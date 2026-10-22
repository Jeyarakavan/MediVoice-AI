import { Schema, model, Document, Types } from 'mongoose';

export interface IPrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity?: number;
}

export interface IPrescription extends Document {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  clinicalNoteId?: Types.ObjectId;
  items: IPrescriptionItem[];
  notes?: string;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionItemSchema = new Schema<IPrescriptionItem>(
  {
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: String,
    quantity: Number,
  },
  { _id: false }
);

const prescriptionSchema = new Schema<IPrescription>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    clinicalNoteId: { type: Schema.Types.ObjectId, ref: 'ClinicalNote' },
    items: [prescriptionItemSchema],
    notes: String,
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

prescriptionSchema.index({ tenantId: 1, patientId: 1 });
prescriptionSchema.index({ tenantId: 1, doctorId: 1 });

export const Prescription = model<IPrescription>('Prescription', prescriptionSchema);
