// src/controllers/NotificationController.js
const NotificationService = require('../services/NotificationService');

class NotificationController {
  async getAll(req, res, next) {
    try {
      const unreadOnly = req.query.unread === 'true';
      const notifications = await NotificationService.getForUser(req.user.userId, unreadOnly);
      res.json(notifications);
    } catch (err) { next(err); }
  }

  async markRead(req, res, next) {
    try {
      await NotificationService.markRead(req.params.id);
      res.json({ message: 'Marked as read.' });
    } catch (err) { next(err); }
  }

  async markAllRead(req, res, next) {
    try {
      await NotificationService.markAllRead(req.user.userId);
      res.json({ message: 'All notifications marked as read.' });
    } catch (err) { next(err); }
  }
}

module.exports = new NotificationController();
