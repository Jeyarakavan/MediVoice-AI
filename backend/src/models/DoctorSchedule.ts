import { Schema, model, Document, Types } from 'mongoose';

// Recurring weekly availability slot
export interface ITimeSlot {
  start: string;   // "HH:MM" 24h
  end: string;     // "HH:MM" 24h
}

export interface IDaySchedule {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday
  isAvailable: boolean;
  slots: ITimeSlot[];
  breakSlots: ITimeSlot[];
}

export interface IDoctorSchedule extends Document {
  tenantId: Types.ObjectId;
  doctorId: Types.ObjectId;
  effectiveFrom: Date;
  effectiveTo?: Date;
  weeklySchedule: IDaySchedule[];
  appointmentDurationMinutes: number;
  maxPatientsPerSlot: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>(
  { start: { type: String, required: true }, end: { type: String, required: true } },
  { _id: false }
);

const dayScheduleSchema = new Schema<IDaySchedule>(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    isAvailable: { type: Boolean, default: true },
    slots: [timeSlotSchema],
    breakSlots: [timeSlotSchema],
  },
  { _id: false }
);

const doctorScheduleSchema = new Schema<IDoctorSchedule>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: Date,
    weeklySchedule: [dayScheduleSchema],
    appointmentDurationMinutes: { type: Number, default: 30 },
    maxPatientsPerSlot: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorScheduleSchema.index({ tenantId: 1, doctorId: 1, isActive: 1 });

export const DoctorSchedule = model<IDoctorSchedule>('DoctorSchedule', doctorScheduleSchema);
