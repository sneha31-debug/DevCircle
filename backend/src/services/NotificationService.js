// src/services/NotificationService.js
const NotificationRepository = require('../repositories/NotificationRepository');

class NotificationService {
  async getForUser(userId, unreadOnly = false) {
    return NotificationRepository.findByRecipient(userId, unreadOnly);
  }

  async markRead(notificationId) {
    return NotificationRepository.markRead(notificationId);
  }

  async markAllRead(userId) {
    return NotificationRepository.markAllRead(userId);
  }
}

module.exports = new NotificationService();
