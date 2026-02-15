// src/models/Admin.js
// Inherits from Moderator — platform-wide control

const Moderator = require('./Moderator');

class Admin extends Moderator {
  constructor(data) {
    super(data);
  }

  canBanUserPlatformWide()  { return true; }
  canDeleteAnyCommunity()   { return true; }
  canViewAuditLogs()        { return true; }
}

module.exports = Admin;
