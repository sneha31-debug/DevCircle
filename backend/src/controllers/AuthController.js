// src/controllers/AuthController.js
const AuthService = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      // Register returns the user; we also sign a token so the user is logged in immediately
      const user    = await AuthService.register(req.body);
      const loginResult = await AuthService.login({ email: req.body.email, password: req.body.password });
      res.status(201).json({ data: { token: loginResult.token, user: loginResult.user } });
    } catch (err) { next(err); }
  }

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      res.json({ data: result });          // { data: { token, user } }
    } catch (err) { next(err); }
  }

  async getMe(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user.userId);
      res.json({ data: { user } });
    } catch (err) { next(err); }
  }
}

module.exports = new AuthController();
