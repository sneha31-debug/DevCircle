// src/models/Member.js
// Inherits from User — adds post, comment, vote capabilities

const User = require('./User');

class Member extends User {
  constructor(data) {
    super(data);
  }

  // These methods return descriptors; actual DB calls happen in services
  canCreatePost() { return !this.isBanned; }
  canComment()    { return !this.isBanned; }
  canVote()       { return !this.isBanned; }
  canJoinCommunity() { return !this.isBanned; }
}

module.exports = Member;
