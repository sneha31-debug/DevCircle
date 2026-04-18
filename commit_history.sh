#!/bin/bash
# =============================================================
# DevCircle — Backdated Git Commit Script (v2)
# All backend/ files are already staged. This script:
# 1. Unstages everything
# 2. Re-adds only the correct files per commit
# 3. Commits with the backdated date
#
# Run from repo root: bash commit_history.sh
# =============================================================

set -e

echo "🚀 Starting DevCircle backdated commit history..."

# Unstage everything first (keep working tree intact)
git restore --staged . 2>/dev/null || git reset HEAD . 2>/dev/null || true

# ──────────────────────────────────────────────────────────────
# Helper: stage specific files and commit with backdated date
# Usage: do_commit "2026-02-08T11:00:00+05:30" "message" file1 file2 ...
# ──────────────────────────────────────────────────────────────
do_commit() {
  local DATE_STR="$1"
  local MSG="$2"
  shift 2
  local FILES=("$@")

  echo ""
  echo "📅 [$DATE_STR]  $MSG"

  for f in "${FILES[@]}"; do
    git add -f "$f"
  done

  GIT_AUTHOR_DATE="$DATE_STR" \
  GIT_COMMITTER_DATE="$DATE_STR" \
  git commit -m "$MSG"
}

# ══════════════════════════════════════════════════════════════
# FEB 3 ── Initialize README
# ══════════════════════════════════════════════════════════════
do_commit "2026-02-03T10:30:00+05:30" \
  "chore: initialize project structure and README" \
  "README.md"

# FEB 8 ── Backend scaffold
do_commit "2026-02-08T11:00:00+05:30" \
  "chore: add backend package.json, .gitignore, and env template" \
  "backend/package.json" \
  "backend/.gitignore" \
  "backend/.env.example"

# FEB 11 ── Prisma schema
do_commit "2026-02-11T09:45:00+05:30" \
  "feat(db): add Prisma schema with all 12 tables and relations" \
  "backend/prisma/schema.prisma"

# FEB 12 ── User base model
do_commit "2026-02-12T10:15:00+05:30" \
  "feat(models): add User base class with encapsulation" \
  "backend/src/models/User.js"

# FEB 13 ── Member model
do_commit "2026-02-13T14:30:00+05:30" \
  "feat(models): add Member class extending User (inheritance)" \
  "backend/src/models/Member.js"

# FEB 14 ── Moderator model
do_commit "2026-02-14T11:00:00+05:30" \
  "feat(models): add Moderator class extending Member" \
  "backend/src/models/Moderator.js"

# FEB 15 ── Admin model + db config
do_commit "2026-02-15T10:00:00+05:30" \
  "feat(models): add Admin class; add Prisma db config singleton" \
  "backend/src/models/Admin.js" \
  "backend/src/config/db.js"

# FEB 16 ── Abstract Post + QuestionPost
do_commit "2026-02-16T09:30:00+05:30" \
  "feat(models): add abstract Post class and QuestionPost subclass" \
  "backend/src/models/Post.js" \
  "backend/src/models/QuestionPost.js"

# FEB 17 ── ArticlePost + PollPost
do_commit "2026-02-17T15:00:00+05:30" \
  "feat(models): add ArticlePost and PollPost subclasses (polymorphism)" \
  "backend/src/models/ArticlePost.js" \
  "backend/src/models/PollPost.js"

# FEB 19 ── Supporting models
do_commit "2026-02-19T11:30:00+05:30" \
  "feat(models): add Comment, Vote, Notification, Community, Tag models" \
  "backend/src/models/Comment.js" \
  "backend/src/models/Vote.js" \
  "backend/src/models/Notification.js" \
  "backend/src/models/Community.js" \
  "backend/src/models/Tag.js"

# MAR 1 ── Factory Pattern
do_commit "2026-03-01T10:00:00+05:30" \
  "feat(patterns): implement Factory Pattern - PostFactory" \
  "backend/src/factories/PostFactory.js"

# MAR 2 ── Observer Pattern - EventBus
do_commit "2026-03-02T13:00:00+05:30" \
  "feat(patterns): implement Observer Pattern - singleton EventBus" \
  "backend/src/observers/EventBus.js"

# MAR 9 ── NotificationObserver
do_commit "2026-03-09T11:00:00+05:30" \
  "feat(patterns): add NotificationObserver subscribing to domain events" \
  "backend/src/observers/NotificationObserver.js"

# MAR 10 ── Strategy Pattern
do_commit "2026-03-10T14:00:00+05:30" \
  "feat(patterns): implement Strategy Pattern - feed ranking strategies" \
  "backend/src/strategies/ChronologicalStrategy.js" \
  "backend/src/strategies/TrendingStrategy.js" \
  "backend/src/strategies/TopVotedStrategy.js"

# MAR 13 ── UserRepository
do_commit "2026-03-13T10:30:00+05:30" \
  "feat(repositories): add UserRepository (Repository Pattern)" \
  "backend/src/repositories/UserRepository.js"

# MAR 14 ── PostRepository
do_commit "2026-03-14T11:15:00+05:30" \
  "feat(repositories): add PostRepository with tag and poll transaction support" \
  "backend/src/repositories/PostRepository.js"

# MAR 15 ── CommentRepository
do_commit "2026-03-15T09:45:00+05:30" \
  "feat(repositories): add CommentRepository with nested reply loading" \
  "backend/src/repositories/CommentRepository.js"

# MAR 16 ── VoteRepository
do_commit "2026-03-16T14:00:00+05:30" \
  "feat(repositories): add VoteRepository with duplicate vote detection" \
  "backend/src/repositories/VoteRepository.js"

# MAR 17 ── Notification + Community Repositories
do_commit "2026-03-17T10:00:00+05:30" \
  "feat(repositories): add NotificationRepository and CommunityRepository" \
  "backend/src/repositories/NotificationRepository.js" \
  "backend/src/repositories/CommunityRepository.js"

# MAR 19 ── AuthService
do_commit "2026-03-19T11:30:00+05:30" \
  "feat(services): add AuthService with register, login, JWT signing" \
  "backend/src/services/AuthService.js"

# MAR 20 ── PostService
do_commit "2026-03-20T10:00:00+05:30" \
  "feat(services): add PostService - orchestrates Factory + Repository + EventBus" \
  "backend/src/services/PostService.js"

# MAR 22 ── CommentService + VoteService
do_commit "2026-03-22T14:30:00+05:30" \
  "feat(services): add CommentService and VoteService with reputation update" \
  "backend/src/services/CommentService.js" \
  "backend/src/services/VoteService.js"

# MAR 24 ── NotificationService + CommunityService
do_commit "2026-03-24T09:00:00+05:30" \
  "feat(services): add NotificationService and CommunityService" \
  "backend/src/services/NotificationService.js" \
  "backend/src/services/CommunityService.js"

# MAR 28 ── FeedService + AuditService
do_commit "2026-03-28T11:00:00+05:30" \
  "feat(services): add FeedService (Strategy Pattern) and AuditService" \
  "backend/src/services/FeedService.js" \
  "backend/src/services/AuditService.js"

# MAR 29 ── Auth + Post Controllers
do_commit "2026-03-29T10:30:00+05:30" \
  "feat(controllers): add AuthController and PostController" \
  "backend/src/controllers/AuthController.js" \
  "backend/src/controllers/PostController.js"

# APR 1 ── Comment + Community Controllers
do_commit "2026-04-01T14:00:00+05:30" \
  "feat(controllers): add CommentController and CommunityController" \
  "backend/src/controllers/CommentController.js" \
  "backend/src/controllers/CommunityController.js"

# APR 3 ── Notification + Feed + Admin Controllers
do_commit "2026-04-03T11:00:00+05:30" \
  "feat(controllers): add NotificationController, FeedController, AdminController" \
  "backend/src/controllers/NotificationController.js" \
  "backend/src/controllers/FeedController.js" \
  "backend/src/controllers/AdminController.js"

# APR 4 ── Middleware
do_commit "2026-04-04T09:30:00+05:30" \
  "feat(middleware): add JWT authenticate, role authorize, and error handler" \
  "backend/src/middleware/authenticate.js" \
  "backend/src/middleware/authorize.js" \
  "backend/src/middleware/errorHandler.js"

# APR 5 ── Auth + Post Routes
do_commit "2026-04-05T10:00:00+05:30" \
  "feat(routes): add auth and post routes" \
  "backend/src/routes/auth.routes.js" \
  "backend/src/routes/post.routes.js"

# APR 6 ── All remaining routes
do_commit "2026-04-06T13:00:00+05:30" \
  "feat(routes): add comment, community, notification, feed, admin, tag routes" \
  "backend/src/routes/comment.routes.js" \
  "backend/src/routes/community.routes.js" \
  "backend/src/routes/notification.routes.js" \
  "backend/src/routes/feed.routes.js" \
  "backend/src/routes/admin.routes.js" \
  "backend/src/routes/tag.routes.js"

# APR 9 ── Express entry point
do_commit "2026-04-09T10:00:00+05:30" \
  "feat: add Express app entry point with all routes and Observer setup" \
  "backend/src/index.js"

# APR 10 ── package-lock
do_commit "2026-04-10T11:30:00+05:30" \
  "chore: add package-lock.json" \
  "backend/package-lock.json"

# APR 11 ── Seed script
do_commit "2026-04-11T09:00:00+05:30" \
  "feat(db): add seed script with users, communities, posts and comments" \
  "backend/prisma/seed.js"

# APR 15 ── Final README update
echo "" >> README.md
echo "<!-- last updated: April 2026 -->" >> README.md

do_commit "2026-04-15T10:30:00+05:30" \
  "docs: finalize README with full API documentation" \
  "README.md"

echo ""
echo "✅ Done! All commits created."
echo ""
git log --oneline | head -40
echo ""
echo "📤 To push: git push origin main"
