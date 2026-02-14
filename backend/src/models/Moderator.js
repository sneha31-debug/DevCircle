// src/models/Moderator.js
// Inherits from Member — adds community moderation capabilities

const Member = require('./Member');

class Moderator extends Member {
  constructor(data) {
    super(data);
    this.communityId = data.communityId || null;
  }

  canDeletePost()    { return true; }
  canDeleteComment() { return true; }
  canBanFromCommunity() { return true; }
  canUpdateCommunitySettings() { return true; }
}

module.exports = Moderator;
