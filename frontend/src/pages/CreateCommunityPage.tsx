import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateCommunityPage.css';

const CreateCommunityPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-flight validation
    if (!name.trim() || !description.trim()) {
      setError('Both Name and Description are entirely required.');
      return;
    }
    
    // Prevent spaces and special chars in routing name
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setError('Community name can only contain letters, numbers, and underscores (no spaces).');
      return;
    }

    if (name.length > 21) {
      setError('Community names cannot exceed 21 characters.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/communities', {
        name: name.trim(),
        description: description.trim()
      });
      
      // Instantly reroute them into their newly minted community!
      navigate(`/c/${name.trim()}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'A network error occurred generating this community.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-community-page container animate-fade-in" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="create-community-card glass-panel">
        
        <div className="create-community-header">
          <h1>Initialize a Community</h1>
          <p>Create a dedicated space for discussions, questions, and insights.</p>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', border: '1px solid #ef4444' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="name">Community Name</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>c/</span>
              <input 
                id="name"
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="RustLang"
                disabled={loading}
              />
            </div>
            <span className="form-help-text">
              Names cannot have spaces (e.g., "WebDev", not "Web Dev"). Maximum 21 characters.
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              className="form-input" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A community dedicated to the performance and safety of systems programming..."
              disabled={loading}
            ></textarea>
            <span className="form-help-text">
              Briefly let people know what your community is all about. This helps others find you.
            </span>
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Initializing Community...' : 'Create Community'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateCommunityPage;
