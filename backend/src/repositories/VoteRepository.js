// src/repositories/VoteRepository.js
const prisma = require('../config/db');

class VoteRepository {
  async findExisting(voterId, targetId, targetType) {
    return prisma.vote.findUnique({
      where: { voterId_targetId_targetType: { voterId, targetId, targetType } },
    });
  }

  async save(data) {
    return prisma.vote.create({ data });
  }

  async update(id, data) {
    return prisma.vote.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.vote.delete({ where: { id } });
  }
}

module.exports = new VoteRepository();
