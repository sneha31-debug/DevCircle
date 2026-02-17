// src/models/PollPost.js
const Post = require('./Post');

class PollPost extends Post {
  constructor(data) {
    super({ ...data, type: 'POLL' });
    this.options = data.options || [];         // array of { id, optionText, voteCount }
    this.expiresAt = data.expiresAt || null;
  }

  isExpired() {
    return this.expiresAt ? new Date() > new Date(this.expiresAt) : false;
  }

  getResults() {
    const total = this.options.reduce((sum, o) => sum + (o.voteCount || 0), 0);
    return this.options.map(o => ({
      optionText: o.optionText,
      voteCount: o.voteCount || 0,
      percentage: total > 0 ? Math.round(((o.voteCount || 0) / total) * 100) : 0,
    }));
  }

  render() {
    return `[POLL] ${this.title} — ${this.options.length} options${this.isExpired() ? ' (Expired)' : ''}`;
  }

  validate() {
    if (!this.title || this.title.trim().length < 5) {
      throw new Error('Poll title must be at least 5 characters.');
    }
    if (!this.options || this.options.length < 2) {
      throw new Error('Poll must have at least 2 options.');
    }
    return true;
  }

  toJSON() {
    return { ...super.toJSON(), options: this.options, expiresAt: this.expiresAt, results: this.getResults() };
  }
}

module.exports = PollPost;
