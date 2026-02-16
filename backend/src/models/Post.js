// src/models/Post.js
// Abstract base class — subclasses must implement render() and validate()

class Post {
  constructor({ id, title, body, type, authorId, communityId, upvotes, downvotes, createdAt, updatedAt, tags }) {
    if (new.target === Post) {
      throw new Error('Post is abstract and cannot be instantiated directly.');
    }
    this.id = id;
    this.title = title;
    this.body = body;
    this.type = type;
    this.authorId = authorId;
    this.communityId = communityId;
    this.upvotes = upvotes || 0;
    this.downvotes = downvotes || 0;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tags = tags || [];
  }

  getVoteScore() {
    return this.upvotes - this.downvotes;
  }

  // Abstract — must override
  render()   { throw new Error('render() must be implemented by subclass'); }
  validate() { throw new Error('validate() must be implemented by subclass'); }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      body: this.body,
      type: this.type,
      authorId: this.authorId,
      communityId: this.communityId,
      upvotes: this.upvotes,
      downvotes: this.downvotes,
      voteScore: this.getVoteScore(),
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Post;
