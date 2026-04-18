import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PostCard, { Post } from '../../components/post/PostCard';
import { FiTrendingUp, FiClock, FiStar } from 'react-icons/fi';
import './FeedPage.css';

type FeedStrategy = 'recent' | 'trending' | 'top';

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [strategy, setStrategy] = useState<FeedStrategy>('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/feed?strategy=${strategy}`);
        setPosts(response.data.data.posts);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to heavily load feed');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [strategy]);

  const handleVote = async (postId: string, type: 'UPVOTE' | 'DOWNVOTE') => {
    try {
      await api.post(`/posts/${postId}/vote`, { type });
      
      // Optimistic update locally
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
      console.error('Vote failed', err);
      // In a real app we'd trigger a toast notification here
      alert(err.response?.data?.message || 'Must be logged in to vote');
    }
  };

  return (
    <div className="feed-container container animate-fade-in" style={{ paddingTop: '90px' }}>
      
      <div className="feed-layout">
        {/* Main Feed Column */}
        <div className="feed-main">
          
          <div className="feed-header glass-panel">
            <h2>Your Feed</h2>
            <div className="strategy-toggle">
              <button 
                className={`strategy-btn ${strategy === 'recent' ? 'active' : ''}`}
                onClick={() => setStrategy('recent')}
              >
                <FiClock /> Recent
              </button>
              <button 
                className={`strategy-btn ${strategy === 'trending' ? 'active' : ''}`}
                onClick={() => setStrategy('trending')}
              >
                <FiTrendingUp /> Trending
              </button>
              <button 
                className={`strategy-btn ${strategy === 'top' ? 'active' : ''}`}
                onClick={() => setStrategy('top')}
              >
                <FiStar /> Top Voted
              </button>
            </div>
          </div>

          {error && <div className="feed-error">{error}</div>}

          <div className="feed-posts">
            {loading ? (
              <div className="feed-loading">
                <div className="loader"></div>
                <p>Loading {strategy} posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="feed-empty glass-panel">
                <h3>No posts found</h3>
                <p>Be the first to create a post in DevCircle!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onVote={handleVote} />
              ))
            )}
          </div>
          
        </div>

        {/* Right Sidebar (Trending Tags etc) */}
        <aside className="feed-sidebar hidden-mobile">
          <div className="sidebar-card glass-panel">
            <h3>DevCircle</h3>
            <p>Your portal for developer discussions, questions, and polls. Build your reputation securely.</p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Create Post
            </button>
          </div>
          
          <div className="sidebar-card glass-panel" style={{ marginTop: '1rem' }}>
            <h3>Popular Communities</h3>
            <ul className="sidebar-list">
              <li><a href="/c/JavaScript">c/JavaScript</a></li>
              <li><a href="/c/React">c/React</a></li>
              <li><a href="/c/SystemDesign">c/SystemDesign</a></li>
            </ul>
          </div>
        </aside>
      </div>
      
    </div>
  );
};

export default FeedPage;
