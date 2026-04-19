import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiStar, FiCalendar, FiUsers } from 'react-icons/fi';
import { format } from 'timeago.js';
import './MembersPage.css';

interface User {
  id: string;
  username: string;
  role: string;
  reputationScore: number;
  avatarUrl: string | null;
  createdAt: string;
}

const MembersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data.data.users);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load members directory');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="container" style={{ paddingTop: '90px' }}><div className="loader mx-auto"></div></div>;
  if (error) return <div className="container" style={{ paddingTop: '90px' }}><div className="feed-error">{error}</div></div>;

  return (
    <div className="members-page container animate-fade-in" style={{ paddingTop: '90px' }}>
      
      <div className="members-header glass-panel">
        <FiUsers className="header-icon" />
        <div>
          <h1>DevCircle Members</h1>
          <p className="text-muted">Discover and connect with developers across {users.length} registered accounts.</p>
        </div>
      </div>

      <div className="members-grid">
        {users.map(user => (
          <Link key={user.id} to={`/u/${user.username}`} className="member-card glass-card">
            <div className="member-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className="member-info">
              <h3>{user.username}</h3>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role === 'ADMIN' ? 'Site Admin' : user.role === 'MODERATOR' ? 'Mod' : 'Member'}
              </span>
              <div className="member-stats">
                <span><FiStar /> {user.reputationScore}</span>
                <span><FiCalendar /> {format(user.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
};

export default MembersPage;
