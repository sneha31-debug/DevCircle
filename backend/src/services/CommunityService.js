// src/services/CommunityService.js
const CommunityRepository = require('../repositories/CommunityRepository');

class CommunityService {
  async getAll() {
    return CommunityRepository.findAll();
  }

  async getById(id) {
    const community = await CommunityRepository.findById(id);
    if (!community) throw Object.assign(new Error('Community not found.'), { status: 404 });
    return community;
  }

  async create(moderatorId, { name, description }) {
    const existing = await CommunityRepository.findByName(name);
    if (existing) throw Object.assign(new Error('Community name already exists.'), { status: 409 });
    const community = await CommunityRepository.save({ name, description, moderatorId, memberCount: 1 });
    // Auto-join the creator
    await CommunityRepository.addMember(moderatorId, community.id);
    return community;
  }

  async join(userId, communityId) {
    const community = await CommunityRepository.findById(communityId);
    if (!community) throw Object.assign(new Error('Community not found.'), { status: 404 });
    const already = await CommunityRepository.isMember(userId, communityId);
    if (already) throw Object.assign(new Error('Already a member.'), { status: 409 });
    await CommunityRepository.addMember(userId, communityId);
    return { message: 'Joined successfully.' };
  }

  async leave(userId, communityId) {
    const community = await CommunityRepository.findById(communityId);
    if (!community) throw Object.assign(new Error('Community not found.'), { status: 404 });
    const isMember = await CommunityRepository.isMember(userId, communityId);
    if (!isMember) throw Object.assign(new Error('Not a member.'), { status: 400 });
    await CommunityRepository.removeMember(userId, communityId);
    return { message: 'Left community.' };
  }

  async delete(communityId, actorId, role) {
    if (role !== 'ADMIN') throw Object.assign(new Error('Only admins can delete communities.'), { status: 403 });
    await CommunityRepository.delete(communityId);
  }
}

module.exports = new CommunityService();
