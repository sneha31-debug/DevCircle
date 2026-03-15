// src/repositories/CommentRepository.js
const prisma = require('../config/db');

const COMMENT_INCLUDE = {
  author: { select: { id: true, username: true, avatarUrl: true } },
  replies: {
    include: { author: { select: { id: true, username: true, avatarUrl: true } } },
    orderBy: { createdAt: 'asc' },
  },
};

class CommentRepository {
  async findById(id) {
    return prisma.comment.findUnique({ where: { id }, include: COMMENT_INCLUDE });
  }

  async findByPost(postId) {
    return prisma.comment.findMany({
      where: { postId, parentCommentId: null }, // top-level only
      include: COMMENT_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });
  }

  async save(data) {
    return prisma.comment.create({ data, include: COMMENT_INCLUDE });
  }

  async update(id, data) {
    return prisma.comment.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.comment.delete({ where: { id } });
  }
}

module.exports = new CommentRepository();
