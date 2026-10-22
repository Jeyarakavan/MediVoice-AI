import { Schema, model, Document, Types } from 'mongoose';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'no_show';

export type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'procedure' | 'other';

export interface IAppointmentHistory {
  changedAt: Date;
  changedBy: Types.ObjectId;
  previousStatus: AppointmentStatus;
  newStatus: AppointmentStatus;
  reason?: string;
  previousDate?: Date;
  newDate?: Date;
}

export interface IAppointment extends Document {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  departmentId?: Types.ObjectId;
  bookingReference: string;
  appointmentType: AppointmentType;
  scheduledAt: Date;                  // UTC datetime of appointment start
  durationMinutes: number;
  status: AppointmentStatus;
  cancellationReason?: string;
  rescheduledFromId?: Types.ObjectId; // original appointment ID
  rescheduledToId?: Types.ObjectId;   // new appointment ID
  notes?: string;                     // booking notes (not clinical)
  consultationFee?: number;
  bookedBy: Types.ObjectId;           // user who made the booking
  bookedVia: 'web' | 'phone' | 'ai_call' | 'manual';
  callId?: Types.ObjectId;
  history: IAppointmentHistory[];
  reminderSentAt?: Date;
  confirmationSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentHistorySchema = new Schema<IAppointmentHistory>(
  {
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    previousStatus: String,
    newStatus: String,
    reason: String,
    previousDate: Date,
    newDate: Date,
  },
  { _id: false }
);

const appointmentSchema = new Schema<IAppointment>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    bookingReference: { type: String, required: true },
    appointmentType: {
      type: String,
      enum: ['consultation', 'follow_up', 'emergency', 'procedure', 'other'],
      default: 'consultation',
    },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, default: 30 },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show'],
      default: 'scheduled',
    },
    cancellationReason: String,
    rescheduledFromId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    rescheduledToId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    notes: String,
    consultationFee: Number,
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookedVia: {
      type: String,
      enum: ['web', 'phone', 'ai_call', 'manual'],
      default: 'manual',
    },
    callId: { type: Schema.Types.ObjectId, ref: 'Call' },
    history: [appointmentHistorySchema],
    reminderSentAt: Date,
    confirmationSentAt: Date,
  },
  { timestamps: true }
);

// Prevent double-booking: unique active slot per doctor
appointmentSchema.index({ tenantId: 1, doctorId: 1, scheduledAt: 1, status: 1 });
appointmentSchema.index({ tenantId: 1, patientId: 1, scheduledAt: 1 });
appointmentSchema.index({ tenantId: 1, bookingReference: 1 }, { unique: true });
appointmentSchema.index({ tenantId: 1, status: 1 });
appointmentSchema.index({ scheduledAt: 1 }); // for reminder jobs

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);
