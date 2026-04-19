// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticate = require('../middleware/authenticate');

router.get('/', UserController.getAllUsers.bind(UserController));
router.put('/me', authenticate, UserController.updateProfile.bind(UserController));
router.get('/:username', UserController.getProfile.bind(UserController));

module.exports = router;
