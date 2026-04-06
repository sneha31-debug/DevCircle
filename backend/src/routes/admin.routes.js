// src/routes/admin.routes.js
const express          = require('express');
const router           = express.Router();
const AdminController  = require('../controllers/AdminController');
const authenticate     = require('../middleware/authenticate');
const authorize        = require('../middleware/authorize');

const adminOnly = [authenticate, authorize('ADMIN')];

router.get('/audit-logs',              ...adminOnly, AdminController.getAuditLogs.bind(AdminController));
router.patch('/users/:userId/ban',     ...adminOnly, AdminController.banUser.bind(AdminController));
router.patch('/users/:userId/unban',   ...adminOnly, AdminController.unbanUser.bind(AdminController));
router.patch('/users/:userId/role',    ...adminOnly, AdminController.promoteUser.bind(AdminController));
router.delete('/communities/:id',      ...adminOnly, AdminController.deleteCommunity.bind(AdminController));

module.exports = router;
