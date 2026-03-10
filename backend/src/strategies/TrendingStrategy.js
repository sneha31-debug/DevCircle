// src/strategies/TrendingStrategy.js
// Strategy Pattern — rank by Wilson score approximation (votes / age)

class TrendingStrategy {
  rank(posts) {
    const now = Date.now();
    return [...posts].sort((a, b) => {
      const scoreA = this._trendScore(a, now);
      const scoreB = this._trendScore(b, now);
      return scoreB - scoreA;
    });
  }

  _trendScore(post, now) {
    const ageHours = Math.max(1, (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60));
    const voteScore = (post.upvotes || 0) - (post.downvotes || 0);
    return voteScore / Math.pow(ageHours, 1.5); // HN-style gravity
  }
}

module.exports = TrendingStrategy;
