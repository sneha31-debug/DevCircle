// src/routes/auth.routes.js
const express    = require('express');
const router     = express.Router();
const AuthController = require('../controllers/AuthController');
const authenticate   = require('../middleware/authenticate');

router.post('/register', AuthController.register.bind(AuthController));
router.post('/login',    AuthController.login.bind(AuthController));
router.get('/me',        authenticate, AuthController.getMe.bind(AuthController));

module.exports = router;
