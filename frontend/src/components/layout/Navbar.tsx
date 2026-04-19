import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear the bar dynamically
    }
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container container">
        
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">{'</>'}</span>
          <span className="brand-text">DevCircle</span>
        </Link>
        
        {/* Search */}
        <div className="navbar-search hidden-mobile">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>

              <div className="user-menu-wrapper">
                <button className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </button>
                <div className="dropdown-menu glass-panel animate-fade-in">
                  <div className="dropdown-header">
                    <strong>{user.username}</strong>
                    <small>Reputation: {user.reputationScore}</small>
                  </div>
                  <Link to={`/u/${user.username}`} className="dropdown-item">
                    <FiUser /> Profile
                  </Link>
                  <Link to="/create-community" className="dropdown-item">
                    <FiUsers /> Create Community
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary">Sign In</Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="icon-btn mobile-menu-toggle visible-mobile">
            <FiMenu />
          </button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
