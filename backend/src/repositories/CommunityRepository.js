// src/repositories/CommunityRepository.js
const prisma = require('../config/db');

class CommunityRepository {
  async findAll() {
    return prisma.community.findMany({
      include: { moderator: { select: { id: true, username: true } }, members: { select: { userId: true } }, _count: { select: { members: true, posts: true } } },
      orderBy: { memberCount: 'desc' },
    });
  }

  async findById(id) {
    return prisma.community.findUnique({
      where: { id },
      include: { moderator: { select: { id: true, username: true } }, members: { select: { userId: true } }, _count: { select: { members: true, posts: true } } },
    });
  }

  async findByName(name) {
    return prisma.community.findUnique({ where: { name } });
  }

  async save(data) {
    return prisma.community.create({ data });
  }

  async update(id, data) {
    return prisma.community.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.community.delete({ where: { id } });
  }

  async isMember(userId, communityId) {
    const record = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } },
    });
    return !!record;
  }

  async addMember(userId, communityId) {
    await prisma.communityMember.create({ data: { userId, communityId } });
    await prisma.community.update({ where: { id: communityId }, data: { memberCount: { increment: 1 } } });
  }

  async removeMember(userId, communityId) {
    await prisma.communityMember.delete({ where: { userId_communityId: { userId, communityId } } });
    await prisma.community.update({ where: { id: communityId }, data: { memberCount: { decrement: 1 } } });
  }
}

module.exports = new CommunityRepository();
