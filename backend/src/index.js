// src/index.js — Express app entry point
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { setupNotificationObserver } = require('./observers/NotificationObserver');

// ─── Routes ─────────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth.routes');
const postRoutes         = require('./routes/post.routes');
const commentRoutes      = require('./routes/comment.routes');
const communityRoutes    = require('./routes/community.routes');
const notificationRoutes = require('./routes/notification.routes');
const feedRoutes         = require('./routes/feed.routes');
const adminRoutes        = require('./routes/admin.routes');
const tagRoutes          = require('./routes/tag.routes');

const userRoutes         = require('./routes/user.routes');

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/posts',         postRoutes);
app.use('/api/comments',      commentRoutes);
app.use('/api/communities',   communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feed',          feedRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/tags',          tagRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found.` }));

// ─── Error handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 DevCircle API running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health\n`);
  setupNotificationObserver(); // register Observer pattern listeners
});

module.exports = app;
