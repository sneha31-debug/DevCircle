// src/models/Notification.js
class Notification {
  constructor({ id, recipientId, type, message, referenceId, isRead, createdAt }) {
    this.id = id;
    this.recipientId = recipientId;
    this.type = type; // 'NEW_COMMENT' | 'NEW_VOTE' | 'MENTION' | 'ANSWER_ACCEPTED'
    this.message = message;
    this.referenceId = referenceId || null;
    this.isRead = isRead || false;
    this.createdAt = createdAt;
  }

  markAsRead() {
    this.isRead = true;
  }
}

module.exports = Notification;
