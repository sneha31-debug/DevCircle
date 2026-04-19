import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PostCard, { type Post } from '../components/post/PostCard';
import { FiUser, FiStar, FiCalendar, FiFileText, FiEdit2 } from 'react-icons/fi';
import { format } from 'timeago.js';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  reputationScore: number;
  role: string;
  createdAt: string;
  communityMemberships?: { community: { id: string; name: string } }[];
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/users/${username}`);
        const fetchedProfile = response.data.data.user;
        setProfile(fetchedProfile);
        setEditBioText(fetchedProfile.bio || '');
        setPosts(response.data.data.posts);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  const handleVote = async (postId: string, type: 'UPVOTE' | 'DOWNVOTE') => {
    try {
      const response = await api.post(`/posts/${postId}/vote`, { value: type === 'UPVOTE' ? 1 : -1 });
      const { upvotes, downvotes } = response.data.data;
      setPosts((currentPosts) => 
        currentPosts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              upvotes,
              downvotes
            };
          }
          return p;
        })
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to vote');
    }
  };

  const handleSaveBio = async () => {
    if (!profile) return;
    setSavingBio(true);
    try {
      const resp = await api.put('/users/me', { bio: editBioText.trim() });
      setProfile(resp.data.data.user);
      setIsEditingBio(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update bio');
    } finally {
      setSavingBio(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container container animate-fade-in" style={{ paddingTop: '90px' }}>
        <div className="loader mx-auto"></div>
        <p className="text-center mt-3">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-container container animate-fade-in" style={{ paddingTop: '90px' }}>
        <div className="profile-error glass-panel">
          <h2>404</h2>
          <p>{error || 'User not found'}</p>
        </div>
      </div>
    );
  }
  
  const isOwner = currentUser?.username === profile.username;

  return (
    <div className="profile-container container animate-fade-in" style={{ paddingTop: '90px' }}>
      
      {/* Profile Header Card */}
      <div className="profile-header glass-card">
        <div className="profile-avatar-large">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.username} />
          ) : (
             profile.username.charAt(0).toUpperCase()
          )}
        </div>
        
        <div className="profile-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h1 className="profile-username" style={{ marginBottom: 0 }}>{profile.username}</h1>
            {isOwner && !isEditingBio && (
              <button 
                className="icon-btn" 
                onClick={() => setIsEditingBio(true)}
                title="Edit Bio"
                style={{ position: 'relative', top: '2px' }}
              >
                <FiEdit2 />
              </button>
            )}
          </div>
          
          <div className="profile-role-badge" style={{ marginTop: '0.5rem' }}>
            {profile.role === 'ADMIN' ? 'Site Admin' : profile.role === 'MODERATOR' ? 'Community Mod' : 'Member'}
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <FiStar className="stat-icon" />
              <span><strong>{profile.reputationScore}</strong> Reputation</span>
            </div>
            <div className="stat-item">
              <FiFileText className="stat-icon" />
              <span><strong>{posts.length}</strong> Posts</span>
            </div>
            <div className="stat-item">
              <FiCalendar className="stat-icon" />
              <span>Joined {format(profile.createdAt)}</span>
            </div>
          </div>
          
          <div className="profile-bio">
            {isEditingBio ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <textarea 
                  className="form-input" 
                  value={editBioText} 
                  onChange={(e) => setEditBioText(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  disabled={savingBio}
                  style={{ width: '100%', maxWidth: '500px', backgroundColor: 'rgba(0,0,0,0.2)' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={handleSaveBio} disabled={savingBio}>
                    {savingBio ? 'Saving...' : 'Save'}
                  </button>
                  <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }} onClick={() => setIsEditingBio(false)} disabled={savingBio}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              profile.bio ? <p>{profile.bio}</p> : <p className="text-muted">This user hasn't set a bio yet.</p>
            )}
          </div>

          {profile.communityMemberships && profile.communityMemberships.length > 0 && (
            <div className="profile-communities">
              <h4>Joined Communities</h4>
              <div className="communities-list">
                {profile.communityMemberships.map((membership) => (
                  <Link 
                    key={membership.community.id} 
                    to={`/c/${membership.community.name}`} 
                    className="community-pill"
                  >
                    c/{membership.community.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User's Posts Feed */}
      <div className="profile-content">
        <h3 className="profile-section-title">
          <FiUser /> Posts by {profile.username}
        </h3>
        
        <div className="profile-posts">
          {posts.length === 0 ? (
            <div className="feed-empty glass-panel">
              <p>No posts published yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onVote={handleVote} />
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
