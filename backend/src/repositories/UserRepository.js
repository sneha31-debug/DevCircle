// src/repositories/UserRepository.js
// Repository Pattern — abstracts all user DB access

const prisma = require('../config/db');

class UserRepository {
  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username) {
    return prisma.user.findUnique({ 
      where: { username },
      include: {
        communityMemberships: {
          include: { community: true }
        }
      }
    });
  }

  async save(data) {
    return prisma.user.create({ data });
  }

  async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  async updateReputation(userId, delta) {
    return prisma.user.update({
      where: { id: userId },
      data: { reputationScore: { increment: delta } },
    });
  }

  async findAll({ skip = 0, take = 20 } = {}) {
    return prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
  }
}

module.exports = new UserRepository();
