import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import NotificationToast from './components/common/NotificationToast';

import FeedPage from './pages/FeedPage';
import AuthPage from './pages/AuthPage';
import PostDetailPage from './pages/PostDetailPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-wrapper">
          <Navbar />
          <NotificationToast />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/c/:communityName" element={<CommunityPage />} />
              {/* Fallback */}
              <Route path="*" element={<div className="container animate-fade-in" style={{marginTop: '80px'}}><h2>404 Not Found</h2></div>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
