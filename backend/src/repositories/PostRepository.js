// src/repositories/PostRepository.js
const prisma = require('../config/db');

const POST_INCLUDE = {
  author: { select: { id: true, username: true, avatarUrl: true, reputationScore: true } },
  community: { select: { id: true, name: true } },
  tags: { include: { tag: true } },
  pollOptions: true,
  _count: { select: { comments: true } },
};

class PostRepository {
  async findById(id) {
    return prisma.post.findUnique({ where: { id }, include: POST_INCLUDE });
  }

  async findByCommunity(communityId, { skip = 0, take = 20 } = {}) {
    return prisma.post.findMany({
      where: { communityId },
      include: POST_INCLUDE,
      skip,
      take,
    });
  }

  async findAll({ skip = 0, take = 20, type, communityId, tagName } = {}) {
    const where = {};
    if (type) where.type = type;
    if (communityId) where.communityId = communityId;
    if (tagName) where.tags = { some: { tag: { name: tagName } } };

    return prisma.post.findMany({ where, include: POST_INCLUDE, skip, take });
  }

  async save(data, tagNames = [], pollOptions = []) {
    return prisma.$transaction(async (tx) => {
      // Upsert tags
      const tagConnects = [];
      for (const name of tagNames) {
        const tag = await tx.tag.upsert({
          where: { name },
          update: { usageCount: { increment: 1 } },
          create: { name, usageCount: 1 },
        });
        tagConnects.push({ tagId: tag.id });
      }

      return tx.post.create({
        data: {
          ...data,
          tags: tagNames.length ? { create: tagConnects } : undefined,
          pollOptions: pollOptions.length
            ? { create: pollOptions.map(text => ({ optionText: text })) }
            : undefined,
        },
        include: POST_INCLUDE,
      });
    });
  }

  async update(id, data) {
    return prisma.post.update({ where: { id }, data, include: POST_INCLUDE });
  }

  async delete(id) {
    return prisma.post.delete({ where: { id } });
  }

  async search(query) {
    return prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { body: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: POST_INCLUDE,
      take: 20,
    });
  }
}

module.exports = new PostRepository();
