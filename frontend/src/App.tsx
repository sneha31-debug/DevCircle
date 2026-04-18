import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';

// Placeholder Pages (will be implemented next)
const FeedPage = () => <div className="container animate-fade-in" style={{marginTop: '80px'}}><h2>Discover Feed</h2><p>Posts will appear here.</p></div>;
const AuthPage = () => <div className="container animate-fade-in" style={{marginTop: '80px'}}><h2>Login / Register</h2></div>;
const PostDetailPage = () => <div className="container animate-fade-in" style={{marginTop: '80px'}}><h2>Post Detail</h2></div>;
const CommunityPage = () => <div className="container animate-fade-in" style={{marginTop: '80px'}}><h2>Community</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-wrapper">
          <Navbar />
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
