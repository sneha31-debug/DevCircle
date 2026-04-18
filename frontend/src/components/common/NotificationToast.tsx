import React, { useState, useEffect } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import './NotificationToast.css';

interface NotificationProps {
  // In a real app this would attach to a socket.io or SSE stream
  // We're stubbing the UI container here for completeness of Phase 7
}

const NotificationToast: React.FC<NotificationProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  // Sample simulation of an incoming Observer pattern notification
  useEffect(() => {
    // Simulate a notification arriving 5 seconds after load
    const timer = setTimeout(() => {
      setMessage('u/carol_js commented on your Question!');
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="notification-toast glass-panel animate-fade-in">
      <div className="toast-icon">
        <FiBell />
      </div>
      <div className="toast-content">
        <h4>New Activity</h4>
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={() => setIsVisible(false)}>
        <FiX />
      </button>
    </div>
  );
};

export default NotificationToast;
