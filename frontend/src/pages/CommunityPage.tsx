import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiUsers, FiInfo } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard, { type Post } from '../components/post/PostCard';
import './CommunityPage.css';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

const CommunityPage: React.FC = () => {
  const { communityName } = useParams<{ communityName: string }>();
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        const commRes = await api.get(`/communities`);
        const communities = Array.isArray(commRes.data) ? commRes.data : commRes.data?.data || [];
        const found = communities.find((c: any) => c.name === communityName);
        if (!found) throw new Error('Community not found');
        setCommunity(found);
        
        // Initial membership check
        if (user && found.members) {
          setIsMember(found.members.some((m: any) => m.userId === user.id));
        }

        const postsRes = await api.get(`/feed?strategy=recent`);
        const commPosts = postsRes.data.data.posts.filter((p: Post) => p.community.name === communityName);
        setPosts(commPosts);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load community');
      } finally {
        setLoading(false);
      }
    };

    if (communityName) fetchCommunityData();
  }, [communityName, user]);

  const handleJoinToggle = async () => {
    if (!community) return;
    
    // Check if the user is authenticated first
    if (!user) {
      alert("Please log in to join communities!");
      return;
    }

    const prev = isMember;
    setIsMember(!prev);
    setCommunity({
      ...community,
      memberCount: prev ? community.memberCount - 1 : community.memberCount + 1
    });

    try {
      if (prev) {
        await api.delete(`/communities/${community.id}/leave`);
      } else {
        await api.post(`/communities/${community.id}/join`);
      }
    } catch (err: any) {
      // Revert if API fails
      setIsMember(prev);
      setCommunity({
        ...community,
        memberCount: prev ? community.memberCount + 1 : community.memberCount - 1
      });
      alert(err.response?.data?.message || 'Failed to process request');
    }
  };

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
      console.error('Vote failed', err);
      alert(err.response?.data?.message || 'Must be logged in to vote');
    }
  };

  const handlePollVote = async (postId: string, optionId: string) => {
    try {
      await api.post(`/posts/${postId}/poll/${optionId}/vote`);
      setPosts((currentPosts) => 
        currentPosts.map((p) => {
          if (p.id === postId && p.pollOptions) {
            return {
              ...p,
              pollOptions: p.pollOptions.map(opt => 
                opt.id === optionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
              )
            };
          }
          return p;
        })
      );
    } catch (err: any) {
      console.error('Poll vote failed', err);
      alert(err.response?.data?.message || 'Failed to vote on poll');
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '90px' }}><div className="loader"></div></div>;
  if (error || !community) return <div className="container" style={{ marginTop: '90px' }}><div className="feed-error">{error || 'Not found'}</div></div>;

  return (
    <div className="community-page container animate-fade-in" style={{ paddingTop: '90px' }}>
      
      {/* Community Banner Context */}
      <div className="community-banner glass-panel">
        <div className="community-icon-large">
          {community.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="community-info">
          <h1>c/{community.name}</h1>
          <p className="community-desc">{community.description}</p>
          <div className="community-stats">
            <span><FiUsers /> {community.memberCount} Members</span>
            <span className="meta-divider">•</span>
            <span><FiInfo /> Created by DevCircle</span>
          </div>
        </div>
        <div className="community-actions">
          <button 
            className={`btn ${isMember ? 'btn-secondary text-danger' : 'btn-primary'}`}
            onClick={handleJoinToggle}
          >
            {isMember ? 'Leave Community' : 'Join Community'}
          </button>
        </div>
      </div>

      <div className="feed-layout">
        <div className="feed-main">
          {posts.length === 0 ? (
            <div className="feed-empty glass-panel">
              <h3>No posts here yet</h3>
              <p>Be the first to create a post in c/{community.name}!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onVote={handleVote} 
                onPollVote={handlePollVote}
              />
            ))
          )}
        </div>
        
        <aside className="feed-sidebar hidden-mobile">
          <div className="sidebar-card glass-panel">
            <h3>About c/{community.name}</h3>
            <p>{community.description}</p>
          </div>
        </aside>
      </div>

    </div>
  );
};

export default CommunityPage;
