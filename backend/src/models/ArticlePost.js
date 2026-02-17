// src/models/ArticlePost.js
const Post = require('./Post');

class ArticlePost extends Post {
  constructor(data) {
    super({ ...data, type: 'ARTICLE' });
    this.readTimeMinutes = data.readTimeMinutes || ArticlePost.estimateReadTime(data.body);
  }

  static estimateReadTime(body) {
    if (!body) return 1;
    const words = body.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200)); // avg 200 wpm
  }

  render() {
    return `[ARTICLE] ${this.title} — ~${this.readTimeMinutes} min read`;
  }

  validate() {
    if (!this.title || this.title.trim().length < 5) {
      throw new Error('Article title must be at least 5 characters.');
    }
    if (!this.body || this.body.trim().length < 50) {
      throw new Error('Article body must be at least 50 characters.');
    }
    return true;
  }

  toJSON() {
    return { ...super.toJSON(), readTimeMinutes: this.readTimeMinutes };
  }
}

module.exports = ArticlePost;
