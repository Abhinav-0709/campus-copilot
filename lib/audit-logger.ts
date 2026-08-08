import { prisma } from '@/lib/prisma';

export interface AuditLogOptions {
  actorId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export async function logAuditEvent(options: AuditLogOptions): Promise<void> {
  try {
    const auditDelegate = (prisma as any).auditLog;
    if (!auditDelegate) return;

    await auditDelegate.create({
      data: {
        actorId: options.actorId,
        action: options.action,
        resource: options.resource,
        resourceId: options.resourceId || null,
        metadata: options.metadata ? JSON.stringify(options.metadata) : null,
        ipAddress: options.ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Audit Logging Error:', error);
  }
}
