import { Schema, model, Document, Types } from 'mongoose';

export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'in_app';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
export type NotificationEvent =
  | 'appointment_confirmed'
  | 'appointment_reminder'
  | 'appointment_rescheduled'
  | 'appointment_cancelled'
  | 'account_activation'
  | 'password_reset_otp'
  | 'password_changed'
  | 'new_appointment_doctor'
  | 'prescription_ready'
  | 'result_ready'
  | 'general';

export interface INotification extends Document {
  tenantId: Types.ObjectId;
  recipientUserId: Types.ObjectId;
  event: NotificationEvent;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  metadata?: Record<string, unknown>;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  retryCount: number;
  nextRetryAt?: Date;
  externalMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    recipientUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: String, required: true },
    channel: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'in_app'],
      required: true,
    },
    subject: String,
    body: { type: String, required: true },
    metadata: Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'cancelled'],
      default: 'pending',
    },
    sentAt: Date,
    deliveredAt: Date,
    failedAt: Date,
    failureReason: String,
    retryCount: { type: Number, default: 0 },
    nextRetryAt: Date,
    externalMessageId: String,
  },
  { timestamps: true }
);

notificationSchema.index({ tenantId: 1, recipientUserId: 1, status: 1 });
notificationSchema.index({ status: 1, nextRetryAt: 1 }); // for retry jobs
notificationSchema.index({ tenantId: 1, event: 1, createdAt: -1 });

export const Notification = model<INotification>('Notification', notificationSchema);
