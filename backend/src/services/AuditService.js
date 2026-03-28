// src/services/AuditService.js
const prisma = require('../config/db');

class AuditService {
  async log(actorId, action, targetType, targetId, metadata = {}) {
    try {
      await prisma.auditLog.create({
        data: { actorId, action, targetType, targetId, metadata },
      });
    } catch (err) {
      console.error('[AuditService] Failed to log action:', err.message);
    }
  }

  async getLogs() {
    return prisma.auditLog.findMany({
      include: { actor: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}

module.exports = new AuditService();
