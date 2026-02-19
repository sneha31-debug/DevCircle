// src/models/Tag.js
class Tag {
  constructor({ id, name, usageCount }) {
    this.id = id;
    this.name = name;
    this.usageCount = usageCount || 0;
  }
}

module.exports = Tag;
