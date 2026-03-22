// src/services/CommentService.js
const CommentRepository = require('../repositories/CommentRepository');
const PostRepository    = require('../repositories/PostRepository');
const UserRepository    = require('../repositories/UserRepository');
const eventBus          = require('../observers/EventBus');

class CommentService {
  async addComment(postId, authorId, { body, parentCommentId }) {
    const post = await PostRepository.findById(postId);
    if (!post) throw Object.assign(new Error('Post not found.'), { status: 404 });

    const comment = await CommentRepository.save({ postId, authorId, body, parentCommentId: parentCommentId || null });
    const commenter = await UserRepository.findById(authorId);

    eventBus.emit('COMMENT_ADDED', {
      postId,
      commenterId: authorId,
      authorId: post.authorId,
      commenterUsername: commenter?.username || 'Someone',
    });

    return comment;
  }

  async getComments(postId) {
    return CommentRepository.findByPost(postId);
  }

  async deleteComment(commentId, userId, role) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment) throw Object.assign(new Error('Comment not found.'), { status: 404 });
    if (comment.authorId !== userId && role !== 'ADMIN' && role !== 'MODERATOR') {
      throw Object.assign(new Error('Forbidden.'), { status: 403 });
    }
    await CommentRepository.delete(commentId);
  }
}

module.exports = new CommentService();
