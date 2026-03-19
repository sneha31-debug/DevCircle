// src/services/AuthService.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  async register({ username, email, password }) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw Object.assign(new Error('Email already in use.'), { status: 409 });

    const existingUsername = await UserRepository.findByUsername(username);
    if (existingUsername) throw Object.assign(new Error('Username already taken.'), { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserRepository.save({ username, email, passwordHash });
    return this._toDTO(user);
  }

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials.'), { status: 401 });
    if (user.isBanned) throw Object.assign(new Error('Your account has been banned.'), { status: 403 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw Object.assign(new Error('Invalid credentials.'), { status: 401 });

    const token = this._signToken(user);
    return { token, user: this._toDTO(user) };
  }

  async getMe(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
    return this._toDTO(user);
  }

  _signToken(user) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  _toDTO(user) {
    const { passwordHash, ...dto } = user;
    return dto;
  }
}

module.exports = new AuthService();
