// src/factories/PostFactory.js
// Factory Pattern — creates the correct Post subtype at runtime

const QuestionPost = require('../models/QuestionPost');
const ArticlePost  = require('../models/ArticlePost');
const PollPost     = require('../models/PollPost');

class PostFactory {
  static create(type, dto) {
    switch (type) {
      case 'QUESTION':
        return new QuestionPost(dto);
      case 'ARTICLE':
        return new ArticlePost(dto);
      case 'POLL':
        return new PollPost(dto);
      default:
        throw new Error(`Unknown post type: "${type}". Valid types: QUESTION, ARTICLE, POLL`);
    }
  }
}

module.exports = PostFactory;
