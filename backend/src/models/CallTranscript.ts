import { Schema, model, Document, Types } from 'mongoose';

export interface ITranscriptTurn {
  role: 'ai' | 'patient';
  text: string;
  timestamp: Date;
  confidence?: number;
}

export interface ICallTranscript extends Document {
  tenantId: Types.ObjectId;
  callId: Types.ObjectId;
  turns: ITranscriptTurn[];
  summary?: string;                  // AI-generated structured summary
  structuredData?: Record<string, unknown>; // extracted entities (patient, booking)
  audioStoragePath?: string;         // only if consent given
  createdAt: Date;
  updatedAt: Date;
}

const transcriptTurnSchema = new Schema<ITranscriptTurn>(
  {
    role: { type: String, enum: ['ai', 'patient'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, required: true },
    confidence: Number,
  },
  { _id: false }
);

const callTranscriptSchema = new Schema<ICallTranscript>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    callId: { type: Schema.Types.ObjectId, ref: 'Call', required: true, unique: true },
    turns: [transcriptTurnSchema],
    summary: String,
    structuredData: Schema.Types.Mixed,
    audioStoragePath: String,
  },
  { timestamps: true }
);

callTranscriptSchema.index({ tenantId: 1, callId: 1 });

export const CallTranscript = model<ICallTranscript>('CallTranscript', callTranscriptSchema);
