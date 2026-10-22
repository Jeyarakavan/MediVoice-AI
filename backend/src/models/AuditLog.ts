import { Schema, model, Document, Types } from 'mongoose';

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.login_failed'
  | 'user.password_reset'
  | 'user.created'
  | 'user.updated'
  | 'user.deactivated'
  | 'patient.created'
  | 'patient.updated'
  | 'patient.record_accessed'
  | 'appointment.created'
  | 'appointment.updated'
  | 'appointment.cancelled'
  | 'appointment.rescheduled'
  | 'clinical_note.created'
  | 'clinical_note.signed'
  | 'clinical_note.accessed'
  | 'prescription.created'
  | 'document.uploaded'
  | 'document.accessed'
  | 'export.generated'
  | 'tenant.created'
  | 'tenant.updated'
  | 'tenant.suspended'
  | 'call.started'
  | 'call.completed'
  | 'call.escalated';

export interface IAuditLog extends Document {
  tenantId?: Types.ObjectId;
  actorId?: Types.ObjectId;            // user who performed the action
  actorRole?: string;
  action: AuditAction | string;
  resourceType?: string;
  resourceId?: Types.ObjectId;
  details?: Record<string, unknown>;   // safe, sanitised metadata
  ipAddress?: string;
  userAgent?: string;
  result: 'success' | 'failure';
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    actorRole: String,
    action: { type: String, required: true },
    resourceType: String,
    resourceId: Schema.Types.ObjectId,
    details: Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    result: { type: String, enum: ['success', 'failure'], default: 'success' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    // Audit logs are append-only — no updates
  }
);

auditLogSchema.index({ tenantId: 1, createdAt: -1 });
auditLogSchema.index({ tenantId: 1, actorId: 1 });
auditLogSchema.index({ tenantId: 1, action: 1 });
auditLogSchema.index({ tenantId: 1, resourceType: 1, resourceId: 1 });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
