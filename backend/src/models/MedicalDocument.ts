import { Schema, model, Document, Types } from 'mongoose';

export interface IMedicalDocument extends Document {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  relatedTo?: {
    model: 'Investigation' | 'ClinicalNote' | 'Admission' | 'Appointment';
    id: Types.ObjectId;
  };
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;           // local path or cloud key
  storageProvider: 'local' | 's3' | 'gcs';
  description?: string;
  isVisibleToPatient: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const medicalDocumentSchema = new Schema<IMedicalDocument>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedTo: {
      model: { type: String, enum: ['Investigation', 'ClinicalNote', 'Admission', 'Appointment'] },
      id: Schema.Types.ObjectId,
    },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    storagePath: { type: String, required: true },
    storageProvider: { type: String, enum: ['local', 's3', 'gcs'], default: 'local' },
    description: String,
    isVisibleToPatient: { type: Boolean, default: false },
  },
  { timestamps: true }
);

medicalDocumentSchema.index({ tenantId: 1, patientId: 1 });

export const MedicalDocument = model<IMedicalDocument>('MedicalDocument', medicalDocumentSchema);
