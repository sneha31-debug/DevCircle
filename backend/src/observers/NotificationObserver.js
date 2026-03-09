// src/observers/NotificationObserver.js
// Subscribes to domain events and creates notifications

const eventBus = require('./EventBus');
const prisma    = require('../config/db');

function setupNotificationObserver() {
  // POST_CREATED — notify community followers (simplified: no action needed for now)
  eventBus.on('POST_CREATED', async ({ postId, authorId }) => {
    // Could notify followers — skipped for now
  });

  // COMMENT_ADDED — notify post author
  eventBus.on('COMMENT_ADDED', async ({ postId, commenterId, authorId, commenterUsername }) => {
    if (commenterId === authorId) return; // Don't notify yourself
    try {
      await prisma.notification.create({
        data: {
          recipientId: authorId,
          type: 'NEW_COMMENT',
          message: `${commenterUsername} commented on your post.`,
          referenceId: postId,
        },
      });
    } catch (err) {
      console.error('[NotificationObserver] COMMENT_ADDED error:', err.message);
    }
  });

  // VOTE_CAST — notify content author
  eventBus.on('VOTE_CAST', async ({ targetId, voterUsername, authorId, targetType, value }) => {
    if (!authorId) return;
    try {
      await prisma.notification.create({
        data: {
          recipientId: authorId,
          type: 'NEW_VOTE',
          message: `${voterUsername} ${value === 1 ? 'upvoted' : 'downvoted'} your ${targetType.toLowerCase()}.`,
          referenceId: targetId,
        },
      });
    } catch (err) {
      console.error('[NotificationObserver] VOTE_CAST error:', err.message);
    }
  });

  // ANSWER_ACCEPTED — notify comment author
  eventBus.on('ANSWER_ACCEPTED', async ({ postId, commentId, commentAuthorId, postTitle }) => {
    try {
      await prisma.notification.create({
        data: {
          recipientId: commentAuthorId,
          type: 'ANSWER_ACCEPTED',
          message: `Your answer was accepted on: "${postTitle}".`,
          referenceId: postId,
        },
      });
    } catch (err) {
      console.error('[NotificationObserver] ANSWER_ACCEPTED error:', err.message);
    }
  });

  console.log('[NotificationObserver] Registered all event listeners.');
}

module.exports = { setupNotificationObserver };
