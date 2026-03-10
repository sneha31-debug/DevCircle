// src/strategies/ChronologicalStrategy.js
// Strategy Pattern — rank posts by newest first

class ChronologicalStrategy {
  rank(posts) {
    return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

module.exports = ChronologicalStrategy;
