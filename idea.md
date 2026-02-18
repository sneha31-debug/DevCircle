# DevCircle – Developer Community Platform

## Project Overview

DevCircle is a full-stack developer community platform where programmers can ask questions, share articles, participate in discussions, vote on content, and get notified of community activity — similar to a focused blend of Stack Overflow and Reddit for developers.

---

## Scope

The project covers a complete full-stack application with a Node.js/Express backend and a lightweight React frontend. The backend is the core focus, implementing clean layered architecture, OOP principles, and multiple design patterns.

---

## Key Features

### User Management
- User registration and login with JWT-based authentication
- Role-based access control: Guest, Member, Moderator, Admin
- User profiles with bio, avatar, reputation score, and activity history

### Communities
- Users can create and join topic-based communities (e.g., "JavaScript", "System Design")
- Each community has a moderator and description
- Community-level content feeds

### Posts (Polymorphic)
- Three post types supported: **Question**, **Article**, and **Poll**
- Questions can be marked as answered/unanswered
- Articles support markdown content
- Polls have options and vote tracking

### Comments & Replies
- Threaded comments on any post
- Nested replies (one level deep)
- Comment voting (upvote/downvote)

### Voting System
- Upvote/downvote on posts and comments
- Reputation system: authors gain/lose reputation based on votes
- Prevents duplicate votes from the same user

### Tags
- Posts can be tagged with multiple tags (e.g., "async", "OOP", "REST")
- Tag-based search and filtering

### Notifications
- In-app notification system triggered by: new replies, votes on user's content, and mentions
- Observer pattern used to decouple notification logic from business logic

### Search & Feed
- Global search across posts, tags, and communities
- Personalized feed using Strategy pattern (chronological, trending, top-voted)
- Filter by tag, community, or post type

### Moderation
- Moderators can delete posts/comments within their community
- Admins can ban users or remove communities

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Backend     | Node.js, Express.js               |
| Database    | PostgreSQL (primary)              |
| ORM         | Prisma                            |
| Auth        | JWT + bcrypt                      |
| Frontend    | React.js (minimal, backend-focus) |
| API Style   | RESTful API                       |

---

## Software Engineering Highlights

- **Layered Architecture**: Routes → Controllers → Services → Repositories → Models
- **OOP**: Inheritance for user roles; polymorphism for post types; encapsulation in service classes
- **Design Patterns**:
  - **Repository Pattern**: Abstracts data access from business logic
  - **Factory Pattern**: Creates correct Post subtype (Question / Article / Poll) at runtime
  - **Observer Pattern**: Notification system subscribes to post/comment/vote events
  - **Strategy Pattern**: Feed ranking algorithm (trending, recent, top-voted) is swappable at runtime
- **Clean Commits**: Feature-based commits following conventional commit standard
