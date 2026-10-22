import { Schema, model, Document, Types } from 'mongoose';

export type CallStatus = 'initiated' | 'in_progress' | 'completed' | 'failed' | 'escalated' | 'abandoned';
export type CallOutcome = 'appointment_booked' | 'appointment_rescheduled' | 'appointment_cancelled' | 'inquiry_resolved' | 'escalated_to_human' | 'failed' | 'abandoned' | 'other';

export interface ICall extends Document {
  tenantId: Types.ObjectId;
  externalCallId?: string;           // telephony provider call SID
  callerNumber?: string;
  patientId?: Types.ObjectId;        // resolved after verification
  status: CallStatus;
  outcome?: CallOutcome;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds?: number;
  isEscalated: boolean;
  escalationReason?: string;
  bookingReferences: string[];
  aiModel?: string;
  ttsProvider?: string;
  errorDetails?: string;
  consentRecordingGiven: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const callSchema = new Schema<ICall>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    externalCallId: String,
    callerNumber: String,
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    status: {
      type: String,
      enum: ['initiated', 'in_progress', 'completed', 'failed', 'escalated', 'abandoned'],
      default: 'initiated',
    },
    outcome: {
      type: String,
      enum: ['appointment_booked', 'appointment_rescheduled', 'appointment_cancelled',
             'inquiry_resolved', 'escalated_to_human', 'failed', 'abandoned', 'other'],
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    durationSeconds: Number,
    isEscalated: { type: Boolean, default: false },
    escalationReason: String,
    bookingReferences: [String],
    aiModel: String,
    ttsProvider: String,
    errorDetails: String,
    consentRecordingGiven: { type: Boolean, default: false },
  },
  { timestamps: true }
);

callSchema.index({ tenantId: 1, startedAt: -1 });
callSchema.index({ tenantId: 1, patientId: 1 });
callSchema.index({ tenantId: 1, status: 1 });
callSchema.index({ externalCallId: 1 }, { sparse: true });

export const Call = model<ICall>('Call', callSchema);
