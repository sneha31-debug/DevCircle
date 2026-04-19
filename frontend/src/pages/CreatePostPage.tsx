import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreatePostPage.css';

interface Community {
  id: string;
  name: string;
}

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<'QUESTION' | 'ARTICLE' | 'POLL'>('QUESTION');
  const [communityId, setCommunityId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']); // Two default fields for poll

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await api.get('/communities');
        // Handle varying responses, usually an array for this endpoint
        const comms = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCommunities(comms);
        if (comms.length > 0) {
          setCommunityId(comms[0].id);
        }
      } catch (err: any) {
        setError('Could not fetch communities. Try again later.');
      }
    };
    fetchCommunities();
  }, []);

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = val;
    setPollOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || !communityId) {
      setError('Title, body, and targeting a community are required.');
      return;
    }

    setLoading(true);
    setError('');

    // Parse comma separated tags
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    // Filter out blank poll options
    const filteredOptions = pollOptions.map(o => o.trim()).filter(o => o.length > 0);

    const payload = {
      title,
      body,
      type,
      communityId,
      tags,
      ...(type === 'POLL' && { pollOptions: filteredOptions })
    };

    try {
      await api.post('/posts', payload);
      navigate('/feed'); // successfully created, redirect back to feed
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container container animate-fade-in" style={{ paddingTop: '90px' }}>
      <div className="glass-panel form-card">
        <h2>Create a New Post</h2>
        <p className="subtitle">Share a question, write a thought-leadership article, or run a poll in your community.</p>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Community</label>
              <select 
                value={communityId} 
                onChange={e => setCommunityId(e.target.value)} 
                required
              >
                <option value="" disabled>Select a community...</option>
                {communities.map(c => (
                  <option key={c.id} value={c.id}>c/{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group flex-1">
              <label>Post Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as any)}
              >
                <option value="QUESTION">Question</option>
                <option value="ARTICLE">Article</option>
                <option value="POLL">Poll</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              placeholder="Give your post a concise title" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div className="form-group">
            <label>Body</label>
            <textarea 
              placeholder="What are your thoughts?" 
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              rows={8}
            />
          </div>

          {type === 'POLL' && (
            <div className="poll-options-section">
              <label>Poll Options</label>
              {pollOptions.map((opt, i) => (
                <input 
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => handlePollOptionChange(i, e.target.value)}
                  className="poll-option-input"
                />
              ))}
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handleAddPollOption}
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="form-group">
            <label>Tags (Comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. javascript, react, debugging" 
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !communityId}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
