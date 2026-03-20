// src/services/PostService.js
const PostRepository   = require('../repositories/PostRepository');
const PostFactory      = require('../factories/PostFactory');
const eventBus         = require('../observers/EventBus');

class PostService {
  async create(authorId, { title, body, type, communityId, tags = [], pollOptions = [], expiresAt }) {
    // Build via Factory — validates type and creates correct subclass
    const postInstance = PostFactory.create(type, { title, body, type, authorId, communityId, expiresAt });
    postInstance.validate();

    const readTimeMinutes = type === 'ARTICLE' ? postInstance.readTimeMinutes : undefined;

    const saved = await PostRepository.save(
      { title, body, type, authorId, communityId, readTimeMinutes, expiresAt: expiresAt ? new Date(expiresAt) : undefined },
      tags,
      pollOptions
    );

    eventBus.emit('POST_CREATED', { postId: saved.id, authorId });
    return saved;
  }

  async getById(id) {
    const post = await PostRepository.findById(id);
    if (!post) throw Object.assign(new Error('Post not found.'), { status: 404 });
    return post;
  }

  async getAll(filters) {
    return PostRepository.findAll(filters);
  }

  async update(id, userId, role, data) {
    const post = await PostRepository.findById(id);
    if (!post) throw Object.assign(new Error('Post not found.'), { status: 404 });
    if (post.authorId !== userId && role !== 'ADMIN' && role !== 'MODERATOR') {
      throw Object.assign(new Error('Forbidden: you do not own this post.'), { status: 403 });
    }
    return PostRepository.update(id, data);
  }

  async delete(id, userId, role) {
    const post = await PostRepository.findById(id);
    if (!post) throw Object.assign(new Error('Post not found.'), { status: 404 });
    if (post.authorId !== userId && role !== 'ADMIN' && role !== 'MODERATOR') {
      throw Object.assign(new Error('Forbidden.'), { status: 403 });
    }
    await PostRepository.delete(id);
  }

  async acceptAnswer(postId, commentId, userId) {
    const post = await PostRepository.findById(postId);
    if (!post) throw Object.assign(new Error('Post not found.'), { status: 404 });
    if (post.type !== 'QUESTION') throw Object.assign(new Error('Only questions can have accepted answers.'), { status: 400 });
    if (post.authorId !== userId) throw Object.assign(new Error('Only the post author can accept an answer.'), { status: 403 });

    const updated = await PostRepository.update(postId, { isAnswered: true, acceptedCommentId: commentId });

    eventBus.emit('ANSWER_ACCEPTED', {
      postId,
      commentId,
      commentAuthorId: updated.acceptedCommentId,
      postTitle: post.title,
    });
    return updated;
  }

  async search(query) {
    return PostRepository.search(query);
  }
}

module.exports = new PostService();
