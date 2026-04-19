// src/controllers/PostController.js
const PostService    = require('../services/PostService');
const CommentService = require('../services/CommentService');
const VoteService    = require('../services/VoteService');

class PostController {
  async create(req, res, next) {
    try {
      const post = await PostService.create(req.user.userId, req.body);
      res.status(201).json({ data: { post } });
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const { type, communityId, tag } = req.query;
      const posts = await PostService.getAll({ type, communityId, tagName: tag });
      res.json({ data: { posts } });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const post = await PostService.getById(req.params.id);
      res.json({ data: { post } });
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const post = await PostService.update(req.params.id, req.user.userId, req.user.role, req.body);
      res.json({ data: { post } });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await PostService.delete(req.params.id, req.user.userId, req.user.role);
      res.json({ message: 'Post deleted.' });
    } catch (err) { next(err); }
  }

  async addComment(req, res, next) {
    try {
      const comment = await CommentService.addComment(req.params.id, req.user.userId, req.body);
      res.status(201).json({ data: { comment } });
    } catch (err) { next(err); }
  }

  async getComments(req, res, next) {
    try {
      const comments = await CommentService.getComments(req.params.id);
      res.json({ data: { comments } });
    } catch (err) { next(err); }
  }

  async voteOnPost(req, res, next) {
    try {
      const { value } = req.body;
      const result = await VoteService.castVote(req.user.userId, req.params.id, 'POST', value);
      res.json({ data: result });
    } catch (err) { next(err); }
  }

  async acceptAnswer(req, res, next) {
    try {
      const post = await PostService.acceptAnswer(req.params.id, req.params.commentId, req.user.userId);
      res.json({ data: { post } });
    } catch (err) { next(err); }
  }

  async search(req, res, next) {
    try {
      const posts = await PostService.search(req.query.q || '');
      res.json({ data: { posts } });
    } catch (err) { next(err); }
  }
}

module.exports = new PostController();
