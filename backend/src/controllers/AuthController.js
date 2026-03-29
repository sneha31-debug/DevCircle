// src/controllers/AuthController.js
const AuthService = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ message: 'Registered successfully.', user });
    } catch (err) { next(err); }
  }

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (err) { next(err); }
  }

  async getMe(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user.userId);
      res.json(user);
    } catch (err) { next(err); }
  }
}

module.exports = new AuthController();
