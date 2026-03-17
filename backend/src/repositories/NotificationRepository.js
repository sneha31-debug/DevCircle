// src/repositories/NotificationRepository.js
const prisma = require('../config/db');

class NotificationRepository {
  async findByRecipient(userId, unreadOnly = false) {
    return prisma.notification.findMany({
      where: { recipientId: userId, ...(unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async save(data) {
    return prisma.notification.create({ data });
  }

  async markRead(id) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(recipientId) {
    return prisma.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true },
    });
  }
}

module.exports = new NotificationRepository();
