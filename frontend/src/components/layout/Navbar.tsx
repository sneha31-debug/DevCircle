import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
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
          <input type="text" placeholder="Search communities, posts..." />
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <button className="icon-btn" title="Notifications">
                <FiBell />
                {/* Note: Notification badge logic would bind to EventBus / Sockets here */}
                <span className="notification-dot animate-pulse"></span>
              </button>
              
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
