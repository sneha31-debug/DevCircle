import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PostCard, { type Post } from '../components/post/PostCard';
import { FiSearch } from 'react-icons/fi';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}`);
        setPosts(response.data.data.posts);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [query]);

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
      alert(err.response?.data?.message || 'Failed to vote on post.');
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

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '100px' }}>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        <FiSearch style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1>Search Results</h1>
        <p className="text-muted">
          {query ? `Showing results for "${query}"` : 'Please enter a search query.'}
        </p>
      </div>

      {loading ? (
        <div className="loader mx-auto"></div>
      ) : error ? (
        <div className="feed-error">{error}</div>
      ) : posts.length === 0 && query ? (
        <div className="feed-empty glass-panel text-center p-5">
          <h3>No posts found</h3>
          <p>We couldn't find any content matching your search term.</p>
        </div>
      ) : (
        <div className="feed-layout">
          <div className="feed-main">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onVote={handleVote} 
                onPollVote={handlePollVote} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
