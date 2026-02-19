// src/models/Comment.js
class Comment {
  constructor({ id, postId, authorId, parentCommentId, body, upvotes, downvotes, createdAt, updatedAt }) {
    this.id = id;
    this.postId = postId;
    this.authorId = authorId;
    this.parentCommentId = parentCommentId || null;
    this.body = body;
    this.upvotes = upvotes || 0;
    this.downvotes = downvotes || 0;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getVoteScore() {
    return this.upvotes - this.downvotes;
  }

  isReply() {
    return !!this.parentCommentId;
  }
}

module.exports = Comment;
