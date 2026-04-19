import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PostCard, { type Post } from '../components/post/PostCard';
import { FiUser, FiStar, FiCalendar, FiFileText } from 'react-icons/fi';
import { format } from 'timeago.js';
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
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/users/${username}`);
        setProfile(response.data.data.user);
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
      await api.post(`/posts/${postId}/vote`, { type });
      setPosts((currentPosts) => 
        currentPosts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              upvotes: type === 'UPVOTE' ? p.upvotes + 1 : p.upvotes,
              downvotes: type === 'DOWNVOTE' ? p.downvotes + 1 : p.downvotes
            };
          }
          return p;
        })
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to vote');
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
          <h1 className="profile-username">{profile.username}</h1>
          <div className="profile-role-badge">
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
            {profile.bio ? <p>{profile.bio}</p> : <p className="text-muted">This user hasn't set a bio yet.</p>}
          </div>
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
