// src/models/Community.js
class Community {
  constructor({ id, name, description, moderatorId, memberCount, createdAt }) {
    this.id = id;
    this.name = name;
    this.description = description || null;
    this.moderatorId = moderatorId;
    this.memberCount = memberCount || 0;
    this.createdAt = createdAt;
  }
}

module.exports = Community;
