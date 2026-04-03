// src/controllers/AdminController.js
const UserRepository   = require('../repositories/UserRepository');
const AuditService     = require('../services/AuditService');
const CommunityService = require('../services/CommunityService');
const prisma           = require('../config/db');

class AdminController {
  async banUser(req, res, next) {
    try {
      const { userId } = req.params;
      await UserRepository.update(userId, { isBanned: true });
      await AuditService.log(req.user.userId, 'BAN_USER', 'USER', userId);
      res.json({ message: 'User banned.' });
    } catch (err) { next(err); }
  }

  async unbanUser(req, res, next) {
    try {
      const { userId } = req.params;
      await UserRepository.update(userId, { isBanned: false });
      await AuditService.log(req.user.userId, 'UNBAN_USER', 'USER', userId);
      res.json({ message: 'User unbanned.' });
    } catch (err) { next(err); }
  }

  async deleteCommunity(req, res, next) {
    try {
      await CommunityService.delete(req.params.id, req.user.userId, req.user.role);
      await AuditService.log(req.user.userId, 'DELETE_COMMUNITY', 'COMMUNITY', req.params.id);
      res.json({ message: 'Community deleted.' });
    } catch (err) { next(err); }
  }

  async getAuditLogs(req, res, next) {
    try {
      const logs = await AuditService.getLogs();
      res.json(logs);
    } catch (err) { next(err); }
  }

  async promoteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      if (!['MEMBER', 'MODERATOR', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role.' });
      }
      const user = await UserRepository.update(userId, { role });
      await AuditService.log(req.user.userId, `SET_ROLE_${role}`, 'USER', userId);
      res.json(user);
    } catch (err) { next(err); }
  }
}

module.exports = new AdminController();
