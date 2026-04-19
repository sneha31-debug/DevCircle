import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowUp, FiArrowDown, FiMessageSquare, FiCornerDownRight } from 'react-icons/fi';
import { format } from 'timeago.js';
import api from '../services/api';
import type { Post } from '../components/post/PostCard';
import './PostDetailPage.css';

interface Comment {
  id: string;
  body: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  author: {
    username: string;
    reputationScore: number;
  };
  replies?: Comment[];
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string, username: string } | null>(null);

  useEffect(() => {
    const fetchPostContext = async () => {
      try {
        setLoading(true);
        // In a real flow, these might be parallelized or combined
        const postRes = await api.get(`/posts/${id}`);
        setPost(postRes.data.data.post);
        
        const commentsRes = await api.get(`/posts/${id}/comments`);
        // We assume the backend returns threaded comments, or we nest them here
        setComments(commentsRes.data.data.comments);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostContext();
  }, [id]);

  const handlePostVote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (!post) return;
    try {
      await api.post(`/posts/${post.id}/vote`, { type });
      setPost({
        ...post,
        upvotes: type === 'UPVOTE' ? post.upvotes + 1 : post.upvotes,
        downvotes: type === 'DOWNVOTE' ? post.downvotes + 1 : post.downvotes
      });
    } catch (err) {
      console.error('Failed to vote', err);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      const payload = {
        body: newComment,
        parentCommentId: replyTo?.id || null
      };
      
      const res = await api.post(`/posts/${id}/comments`, payload);
      const createdComment = res.data.data.comment;
      
      // Temporary optimistic update (better approach uses swr/react-query refetching)
      if (!replyTo) {
        setComments([...comments, { ...createdComment, author: { username: 'You', reputationScore: 0 }, replies: [] }]);
      }
      
      setNewComment('');
      setReplyTo(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to comment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderCommentForm = () => (
    <form className="comment-form glass-panel" onSubmit={submitComment}>
      {replyTo && (
        <div className="reply-context">
          <span>Replying to u/{replyTo.username}</span>
          <button type="button" onClick={() => setReplyTo(null)}>Cancel</button>
        </div>
      )}
      <textarea
        placeholder="What are your thoughts?"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={4}
        required
      />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Posting...' : 'Comment'}
        </button>
      </div>
    </form>
  );

  const renderCommentThread = (commentList: Comment[], depth = 0) => {
    return commentList.map((comment) => (
      <div key={comment.id} className={`comment-thread depth-${depth}`}>
        <div className="comment-meta">
          <Link to={`/u/${comment.author.username}`} className="comment-author">u/{comment.author.username}</Link>
          <span className="meta-divider">•</span>
          <span className="comment-time">{format(comment.createdAt)}</span>
        </div>
        <div className="comment-body">{comment.body}</div>
        <div className="comment-actions">
          <button className="action-btn"><FiArrowUp /> {comment.upvotes}</button>
          <button className="action-btn"><FiArrowDown /> {comment.downvotes}</button>
          <button 
            className="action-btn" 
            onClick={() => {
              setReplyTo({ id: comment.id, username: comment.author.username });
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
          >
            <FiMessageSquare /> Reply
          </button>
        </div>
        
        {/* Render nested replies recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="nested-replies">
            <div className="thread-line"></div>
            <div className="nested-content">
              {renderCommentThread(comment.replies, depth + 1)}
            </div>
          </div>
        )}
      </div>
    ));
  };

  if (loading) return <div className="container" style={{ marginTop: '90px' }}><div className="loader"></div></div>;
  if (error || !post) return <div className="container" style={{ marginTop: '90px' }}><div className="feed-error">{error || 'Post not found'}</div></div>;

  const score = post.upvotes - post.downvotes;

  return (
    <div className="post-detail-page container animate-fade-in" style={{ paddingTop: '90px' }}>
      
      {/* Post Context */}
      <div className="post-detail-card glass-panel">
        <div className="post-sidebar">
          <button className="vote-btn upvote" onClick={() => handlePostVote('UPVOTE')}><FiArrowUp /></button>
          <span className="vote-score">{score}</span>
          <button className="vote-btn downvote" onClick={() => handlePostVote('DOWNVOTE')}><FiArrowDown /></button>
        </div>
        
        <div className="post-main">
          <div className="post-meta">
            <Link to={`/c/${post.community.name}`} className="meta-community">c/{post.community.name}</Link>
            <span className="meta-divider">•</span>
            <Link to={`/u/${post.author.username}`} className="meta-author">Posted by u/{post.author.username}</Link>
            <span className="meta-divider">•</span>
            <span className="meta-time">{format(post.createdAt)}</span>
          </div>
          
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-tags">
            {post.tags.map(t => <span key={t.tag.id} className="tag-pill">{t.tag.name}</span>)}
          </div>
          
          <div className="post-detail-body">
            {/* If ReactMarkdown was installed, this is where we'd render it. For now, pre-wrap text */}
            <pre className="body-content">{post.body}</pre>
          </div>
        </div>
      </div>

      <div className="comment-section">
        <h3>{comments.length} Comments</h3>
        {renderCommentForm()}
        
        <div className="comments-container">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            renderCommentThread(comments)
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
