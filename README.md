# DevCircle

A full-stack developer community platform — a focused blend of Stack Overflow and Reddit for developers.

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Backend  | Node.js, Express.js |
| Database | PostgreSQL          |
| ORM      | Prisma              |
| Auth     | JWT + bcrypt        |
| Frontend | React.js            |

## Features

- JWT Authentication with role-based access (Guest, Member, Moderator, Admin)
- Communities — create, join, leave topic-based groups
- Polymorphic Posts — Question, Article, Poll
- Threaded Comments & Nested Replies
- Voting System with Reputation
- Tag-based filtering and search
- In-app Notifications (Observer Pattern)
- Strategy-based Feed ranking (Recent, Trending, Top Voted)
- Admin moderation and audit logs

## Design Patterns

- **Factory Pattern** — PostFactory creates correct Post subtype at runtime
- **Repository Pattern** — abstracts all DB access from business logic
- **Observer Pattern** — EventBus + NotificationObserver for decoupled notifications
- **Strategy Pattern** — FeedService with swappable ranking algorithms

## Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npx prisma migrate dev --name init
npm run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/feed | Feed (strategy: recent/trending/top) |
| GET | /api/posts | List posts |
| POST | /api/posts | Create post |
| POST | /api/posts/:id/comments | Add comment |
| POST | /api/posts/:id/vote | Vote on post |
| GET | /api/communities | List communities |
| POST | /api/communities | Create community |
| GET | /api/notifications | Get notifications |

<!-- last updated: April 2025 -->
