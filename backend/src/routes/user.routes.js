// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/:username', UserController.getProfile.bind(UserController));

module.exports = router;
