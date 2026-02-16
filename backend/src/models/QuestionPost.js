// src/models/QuestionPost.js
const Post = require('./Post');

class QuestionPost extends Post {
  constructor(data) {
    super({ ...data, type: 'QUESTION' });
    this.isAnswered = data.isAnswered || false;
    this.acceptedCommentId = data.acceptedCommentId || null;
  }

  markAsAnswered(commentId) {
    this.isAnswered = true;
    this.acceptedCommentId = commentId;
  }

  render() {
    return `[QUESTION] ${this.title} — ${this.isAnswered ? 'Answered ✓' : 'Unanswered'}`;
  }

  validate() {
    if (!this.title || this.title.trim().length < 10) {
      throw new Error('Question title must be at least 10 characters.');
    }
    if (!this.body || this.body.trim().length < 20) {
      throw new Error('Question body must be at least 20 characters.');
    }
    return true;
  }

  toJSON() {
    return { ...super.toJSON(), isAnswered: this.isAnswered, acceptedCommentId: this.acceptedCommentId };
  }
}

module.exports = QuestionPost;
