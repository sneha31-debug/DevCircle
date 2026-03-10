// src/strategies/TopVotedStrategy.js
// Strategy Pattern — rank by highest net vote score

class TopVotedStrategy {
  rank(posts) {
    return [...posts].sort((a, b) => {
      const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
      const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
      return scoreB - scoreA;
    });
  }
}

module.exports = TopVotedStrategy;
