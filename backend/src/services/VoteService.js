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

    let upDelta = 0;
    let downDelta = 0;

    if (existing) {
      if (existing.value === value) {
        // Toggle: same vote again = remove
        await VoteRepository.delete(existing.id);
        delta = -value;
        if (value === 1) upDelta = -1; else downDelta = -1;
      } else {
        // Change vote direction definition (e.g. 1 -> -1)
        await VoteRepository.update(existing.id, { value });
        delta = value * 2; // -1 → +1 = +2 reputation
        if (value === 1) { upDelta = 1; downDelta = -1; }
        else { upDelta = -1; downDelta = 1; }
      }
    } else {
      const voteData = { voterId, targetId, targetType, value };
      if (targetType === 'POST')    voteData.postId = targetId;
      if (targetType === 'COMMENT') voteData.commentId = targetId;
      await VoteRepository.save(voteData);
      delta = value;
      if (value === 1) upDelta = 1; else downDelta = 1;
    }

    // Safely update the tables directly instead of _updateCount which was mathematically flawed
    let upvotesNew = 0;
    let downvotesNew = 0;
    if (targetType === 'POST') {
      const updated = await prisma.post.update({
        where: { id: targetId },
        data: { upvotes: { increment: upDelta }, downvotes: { increment: downDelta } }
      });
      upvotesNew = updated.upvotes;
      downvotesNew = updated.downvotes;
    } else {
      await prisma.comment.update({
        where: { id: targetId },
        data: { upvotes: { increment: upDelta }, downvotes: { increment: downDelta } }
      });
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

    return { success: true, delta, upvotes: upvotesNew, downvotes: downvotesNew };
  }

  async castPollVote(voterId, postId, optionId) {
    const existing = await prisma.pollVote.findUnique({
      where: { postId_userId: { postId, userId: voterId } }
    });
    if (existing) throw Object.assign(new Error('You have already voted on this poll.'), { status: 409 });

    await prisma.pollVote.create({
      data: { postId, userId: voterId, optionId }
    });

    await prisma.pollOption.update({
      where: { id: optionId },
      data: { voteCount: { increment: 1 } }
    });

    return { success: true };
  }
}

module.exports = new VoteService();
