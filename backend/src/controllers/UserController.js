// src/controllers/UserController.js
const UserRepository = require('../repositories/UserRepository');
const PostRepository = require('../repositories/PostRepository');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await UserRepository.findAll();
      // Purge the password hashes completely before transmission
      const safeUsers = users.map(u => {
        const { passwordHash, ...clean } = u;
        return clean;
      });
      res.json({ data: { users: safeUsers } });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const { username } = req.params;
      const user = await UserRepository.findByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Remove sensitive data
      const { passwordHash, ...safeUser } = user;

      // Fetch posts authored by this user
      const posts = await PostRepository.findAll({ authorId: user.id });

      res.json({ data: { user: safeUser, posts } });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { bio } = req.body;
      const updatedUser = await UserRepository.update(req.user.userId, { bio });
      
      const { passwordHash, ...safeUser } = updatedUser;
      res.json({ data: { user: safeUser } });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
