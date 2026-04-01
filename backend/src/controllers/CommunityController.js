// src/controllers/CommunityController.js
const CommunityService = require('../services/CommunityService');
const PostService      = require('../services/PostService');

class CommunityController {
  async getAll(req, res, next) {
    try { res.json(await CommunityService.getAll()); } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try { res.json(await CommunityService.getById(req.params.id)); } catch (err) { next(err); }
  }

  async create(req, res, next) {
    try {
      const community = await CommunityService.create(req.user.userId, req.body);
      res.status(201).json(community);
    } catch (err) { next(err); }
  }

  async join(req, res, next) {
    try {
      const result = await CommunityService.join(req.user.userId, req.params.id);
      res.json(result);
    } catch (err) { next(err); }
  }

  async leave(req, res, next) {
    try {
      const result = await CommunityService.leave(req.user.userId, req.params.id);
      res.json(result);
    } catch (err) { next(err); }
  }

  async getPosts(req, res, next) {
    try {
      const posts = await PostService.getAll({ communityId: req.params.id });
      res.json(posts);
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await CommunityService.delete(req.params.id, req.user.userId, req.user.role);
      res.json({ message: 'Community deleted.' });
    } catch (err) { next(err); }
  }
}

module.exports = new CommunityController();
