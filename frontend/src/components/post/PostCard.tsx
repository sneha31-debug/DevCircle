import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiArrowDown, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import { format } from 'timeago.js';
import './PostCard.css';

interface User {
  username: string;
  reputationScore: number;
}

interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  type: 'QUESTION' | 'ARTICLE' | 'POLL';
  upvotes: number;
  downvotes: number;
  createdAt: string;
  author: User;
  community: { name: string };
  tags: { tag: Tag }[];
  _count: { comments: number };
  // Specific fields
  readTimeMinutes?: number;
  pollOptions?: { id: string; optionText: string; voteCount: number }[];
}

interface PostCardProps {
  post: Post;
  onVote: (postId: string, type: 'UPVOTE' | 'DOWNVOTE') => void;
  onPollVote?: (postId: string, optionId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote, onPollVote }) => {
  const score = post.upvotes - post.downvotes;

  const renderBadge = () => {
    switch (post.type) {
      case 'QUESTION':
        return <span className="post-badge badge-question">Question</span>;
      case 'ARTICLE':
        return <span className="post-badge badge-article">Article • {post.readTimeMinutes} min read</span>;
      case 'POLL':
        return <span className="post-badge badge-poll">Poll</span>;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (post.type === 'POLL' && post.pollOptions) {
      const totalVotes = post.pollOptions.reduce((acc, opt) => acc + opt.voteCount, 0);
      return (
        <div className="poll-container">
          {post.pollOptions.map((opt) => {
            const percentage = totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
            return (
              <div 
                key={opt.id} 
                className={`poll-option-bar ${onPollVote ? 'interactive' : ''}`}
                onClick={() => onPollVote && onPollVote(post.id, opt.id)}
              >
                <div className="poll-option-fill" style={{ width: `${percentage}%` }}></div>
                <span className="poll-option-text">{opt.optionText}</span>
                <span className="poll-option-percent">{percentage}%</span>
              </div>
            );
          })}
          <div className="poll-total">{totalVotes} votes</div>
        </div>
      );
    }
    
    // For Article and Question, show a preview
    return (
      <p className="post-body-preview">
        {post.body.length > 200 ? `${post.body.substring(0, 200)}...` : post.body}
      </p>
    );
  };

  return (
    <article className="post-card glass-panel animate-fade-in">
      <div className="post-vote-col">
        <button className="vote-btn upvote" onClick={() => onVote(post.id, 'UPVOTE')}>
          <FiArrowUp />
        </button>
        <span className="vote-score">{score}</span>
        <button className="vote-btn downvote" onClick={() => onVote(post.id, 'DOWNVOTE')}>
          <FiArrowDown />
        </button>
      </div>
      
      <div className="post-content-col">
        <div className="post-meta">
          <Link to={`/c/${post.community.name}`} className="meta-community">
            c/{post.community.name}
          </Link>
          <span className="meta-divider">•</span>
          <Link to={`/u/${post.author.username}`} className="meta-author">
            Posted by u/{post.author.username} ({post.author.reputationScore})
          </Link>
          <span className="meta-divider">•</span>
          <span className="meta-time">{format(post.createdAt)}</span>
          {renderBadge()}
        </div>
        
        <Link to={`/post/${post.id}`} className="post-title-link">
          <h3 className="post-title">{post.title}</h3>
        </Link>
        
        <div className="post-body">
          {renderContent()}
        </div>
        
        <div className="post-tags">
          {post.tags.map((t) => (
            <span key={t.tag.id} className="tag-pill">{t.tag.name}</span>
          ))}
        </div>
        
        <div className="post-actions">
          <Link to={`/post/${post.id}`} className="action-btn">
            <FiMessageSquare /> {post._count.comments} Comments
          </Link>
          <button 
            className="action-btn"
            onClick={async (e) => {
              e.preventDefault();
              const url = `${window.location.origin}/post/${post.id}`;
              const shareData = {
                title: post.title,
                text: `Check out this post on DevCircle: ${post.title}`,
                url: url
              };
              
              if (navigator.share) {
                try {
                  await navigator.share(shareData);
                } catch (err) {
                  console.error('Native sharing failed or was cancelled.', err);
                }
              } else {
                // Fallback for browsers (like desktop Chrome sometimes) that don't support native sharing
                navigator.clipboard.writeText(url)
                  .then(() => alert('Post link copied to clipboard!'))
                  .catch(err => console.error('Failed to copy', err));
              }
            }}
          >
            <FiShare2 /> Share
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
