// src/controllers/CommentController.js
const CommentService = require('../services/CommentService');
const VoteService    = require('../services/VoteService');

class CommentController {
  async deleteComment(req, res, next) {
    try {
      await CommentService.deleteComment(req.params.id, req.user.userId, req.user.role);
      res.json({ message: 'Comment deleted.' });
    } catch (err) { next(err); }
  }

  async voteOnComment(req, res, next) {
    try {
      const { value } = req.body;
      const result = await VoteService.castVote(req.user.userId, req.params.id, 'COMMENT', value);
      res.json(result);
    } catch (err) { next(err); }
  }
}

module.exports = new CommentController();
