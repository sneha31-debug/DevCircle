// src/services/VoteService.js
const prisma           = require('../config/db');
const VoteRepository   = require('../repositories/VoteRepository');
const UserRepository   = require('../repositories/UserRepository');
const eventBus         = require('../observers/EventBus');

class VoteService {
  async castVote(voterId, targetId, targetType, value) {
    if (![1, -1].includes(value)) throw Object.assign(new Error('Vote value must be 1 or -1.'), { status: 400 });
    if (!['POST', 'COMMENT'].includes(targetType)) throw Object.assign(new Error('Invalid target type.'), { status: 400 });

    const existing = await VoteRepository.findExisting(voterId, targetId, targetType);

    let delta = 0;
    let authorId = null;

    // Determine content author for reputation + notification
    if (targetType === 'POST') {
      const post = await prisma.post.findUnique({ where: { id: targetId }, select: { authorId: true } });
      authorId = post?.authorId;
    } else {
      const comment = await prisma.comment.findUnique({ where: { id: targetId }, select: { authorId: true } });
      authorId = comment?.authorId;
    }

    if (existing) {
      if (existing.value === value) {
        // Toggle: same vote again = remove
        await VoteRepository.delete(existing.id);
        delta = -value;
        await this._updateCount(targetId, targetType, -value);
      } else {
        // Change vote direction
        await VoteRepository.update(existing.id, { value });
        delta = value * 2; // e.g., -1 → +1 = +2 reputation
        await this._updateCount(targetId, targetType, value * 2);
      }
    } else {
      const voteData = { voterId, targetId, targetType, value };
      if (targetType === 'POST')    voteData.postId = targetId;
      if (targetType === 'COMMENT') voteData.commentId = targetId;
      await VoteRepository.save(voteData);
      delta = value;
      await this._updateCount(targetId, targetType, value);
    }

    // Update reputation
    if (authorId && authorId !== voterId) {
      await UserRepository.updateReputation(authorId, delta);
      const voter = await UserRepository.findById(voterId);
      eventBus.emit('VOTE_CAST', {
        targetId,
        voterUsername: voter?.username || 'Someone',
        authorId,
        targetType,
        value,
      });
    }

    return { success: true, delta };
  }

  async _updateCount(targetId, targetType, delta) {
    if (targetType === 'POST') {
      const field = delta > 0 ? 'upvotes' : 'downvotes';
      await prisma.post.update({ where: { id: targetId }, data: { [field]: { increment: Math.abs(delta) } } });
    } else {
      const field = delta > 0 ? 'upvotes' : 'downvotes';
      await prisma.comment.update({ where: { id: targetId }, data: { [field]: { increment: Math.abs(delta) } } });
    }
  }
}

module.exports = new VoteService();
