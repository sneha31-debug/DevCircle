// src/models/Vote.js
class Vote {
  constructor({ id, voterId, targetId, targetType, value, createdAt }) {
    this.id = id;
    this.voterId = voterId;
    this.targetId = targetId;
    this.targetType = targetType; // 'POST' | 'COMMENT'
    this.value = value;           // 1 or -1
    this.createdAt = createdAt;
  }

  isUpvote()   { return this.value === 1; }
  isDownvote() { return this.value === -1; }
}

module.exports = Vote;
