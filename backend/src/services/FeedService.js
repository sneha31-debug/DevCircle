// src/services/FeedService.js
// Strategy Pattern — swappable ranking algorithm at runtime

const PostRepository         = require('../repositories/PostRepository');
const ChronologicalStrategy  = require('../strategies/ChronologicalStrategy');
const TrendingStrategy       = require('../strategies/TrendingStrategy');
const TopVotedStrategy       = require('../strategies/TopVotedStrategy');

const STRATEGIES = {
  recent:   new ChronologicalStrategy(),
  trending: new TrendingStrategy(),
  top:      new TopVotedStrategy(),
};

class FeedService {
  constructor() {
    this.strategy = STRATEGIES.recent; // default
  }

  setStrategy(name) {
    const s = STRATEGIES[name];
    if (!s) throw Object.assign(new Error(`Unknown feed strategy: "${name}". Use: recent, trending, top`), { status: 400 });
    this.strategy = s;
  }

  async getFeed(filters = {}, strategyName = 'recent') {
    this.setStrategy(strategyName);
    const posts = await PostRepository.findAll(filters);
    return this.strategy.rank(posts);
  }
}

module.exports = new FeedService();
