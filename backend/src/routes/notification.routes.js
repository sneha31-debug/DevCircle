// src/routes/notification.routes.js
const express                = require('express');
const router                 = express.Router();
const NotificationController = require('../controllers/NotificationController');
const authenticate           = require('../middleware/authenticate');

router.get('/',                  authenticate, NotificationController.getAll.bind(NotificationController));
router.patch('/:id/read',        authenticate, NotificationController.markRead.bind(NotificationController));
router.patch('/read-all',        authenticate, NotificationController.markAllRead.bind(NotificationController));

module.exports = router;
