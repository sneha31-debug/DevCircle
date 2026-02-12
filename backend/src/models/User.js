// src/models/User.js
// Base class — encapsulation: passwordHash is private-by-convention (prefixed _)

class User {
  constructor({ id, username, email, passwordHash, bio, avatarUrl, reputationScore, role, isBanned, createdAt, updatedAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this._passwordHash = passwordHash;   // private by convention
    this.bio = bio || null;
    this.avatarUrl = avatarUrl || null;
    this.reputationScore = reputationScore || 0;
    this.role = role || 'MEMBER';
    this.isBanned = isBanned || false;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getReputation() {
    return this.reputationScore;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      bio: this.bio,
      avatarUrl: this.avatarUrl,
      reputationScore: this.reputationScore,
      role: this.role,
      isBanned: this.isBanned,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;
