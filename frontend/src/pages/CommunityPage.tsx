import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiUsers, FiInfo } from 'react-icons/fi';
import api from '../services/api';
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
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        // First get community details
        const commRes = await api.get(`/communities`);
        // Dev notes: In a real app we'd have a specific GET /communities/:name
        const communities = Array.isArray(commRes.data) ? commRes.data : commRes.data?.data || [];
        const found = communities.find((c: any) => c.name === communityName);
        if (!found) throw new Error('Community not found');
        setCommunity(found);

        // Then get posts for this community
        // Our backend filter uses query params or we filter client-side if missing
        // Typically: /posts?communityId=xyz
        // For demonstration, we fetch feed and filter locally if a dedicated endpoint isn't wired perfectly
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
  }, [communityName]);

  const handleJoinToggle = () => {
    // Optimistic toggle interaction
    setIsMember(!isMember);
    if (community) {
      setCommunity({
        ...community,
        memberCount: isMember ? community.memberCount - 1 : community.memberCount + 1
      });
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
            className={`btn ${isMember ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleJoinToggle}
          >
            {isMember ? 'Joined' : 'Join Community'}
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
                onVote={(postId) => console.log('Vote localized stub', postId)} 
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
