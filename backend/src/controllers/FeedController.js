// src/controllers/FeedController.js
const FeedService = require('../services/FeedService');

class FeedController {
  async getFeed(req, res, next) {
    try {
      const { strategy = 'recent', type, communityId, tag } = req.query;
      const posts = await FeedService.getFeed(
        { type, communityId, tagName: tag },
        strategy
      );
      res.json({ data: { posts } });
    } catch (err) { next(err); }
  }
}

module.exports = new FeedController();
