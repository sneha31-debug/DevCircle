# ER Diagram – DevCircle

## Overview

This diagram shows all database tables, their columns, primary/foreign keys, and the relationships between them.
Designed for **PostgreSQL** with Prisma ORM.

---

## Diagram

```mermaid
erDiagram

    USERS {
        uuid id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        text bio
        varchar avatar_url
        int reputation_score
        enum role "MEMBER, MODERATOR, ADMIN"
        boolean is_banned
        timestamp created_at
        timestamp updated_at
    }

    COMMUNITIES {
        uuid id PK
        varchar name UK
        text description
        uuid moderator_id FK
        int member_count
        timestamp created_at
    }

    COMMUNITY_MEMBERS {
        uuid user_id FK
        uuid community_id FK
        timestamp joined_at
    }

    POSTS {
        uuid id PK
        varchar title
        text body
        enum type "QUESTION, ARTICLE, POLL"
        uuid author_id FK
        uuid community_id FK
        int upvotes
        int downvotes
        boolean is_answered
        uuid accepted_comment_id FK
        int read_time_minutes
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    POLL_OPTIONS {
        uuid id PK
        uuid post_id FK
        varchar option_text
        int vote_count
    }

    POLL_VOTES {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        uuid option_id FK
        timestamp voted_at
    }

    TAGS {
        uuid id PK
        varchar name UK
        int usage_count
    }

    POST_TAGS {
        uuid post_id FK
        uuid tag_id FK
    }

    COMMENTS {
        uuid id PK
        uuid post_id FK
        uuid author_id FK
        uuid parent_comment_id FK
        text body
        int upvotes
        int downvotes
        timestamp created_at
        timestamp updated_at
    }

    VOTES {
        uuid id PK
        uuid voter_id FK
        uuid target_id
        enum target_type "POST, COMMENT"
        smallint value "1 or -1"
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid recipient_id FK
        enum type "NEW_COMMENT, NEW_VOTE, MENTION, ANSWER_ACCEPTED"
        text message
        uuid reference_id
        boolean is_read
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid actor_id FK
        varchar action
        varchar target_type
        uuid target_id
        jsonb metadata
        timestamp created_at
    }

    %% ── Relationships ──────────────────────────────────────────────

    USERS ||--o{ COMMUNITIES : "moderates"
    USERS ||--o{ COMMUNITY_MEMBERS : "joins"
    COMMUNITIES ||--o{ COMMUNITY_MEMBERS : "has members"

    USERS ||--o{ POSTS : "authors"
    COMMUNITIES ||--o{ POSTS : "contains"

    POSTS ||--o{ POST_TAGS : "tagged with"
    TAGS ||--o{ POST_TAGS : "applied to"

    POSTS ||--o{ COMMENTS : "has"
    USERS ||--o{ COMMENTS : "writes"
    COMMENTS ||--o{ COMMENTS : "replies to"

    POSTS ||--o{ POLL_OPTIONS : "has options"
    POLL_OPTIONS ||--o{ POLL_VOTES : "receives"
    USERS ||--o{ POLL_VOTES : "casts"

    USERS ||--o{ VOTES : "casts"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "generates"

    POSTS ||--o| COMMENTS : "accepted answer"
```

---

## Table Notes

| Table             | Purpose                                                              |
|-------------------|----------------------------------------------------------------------|
| USERS             | Core user accounts with role-based access                           |
| COMMUNITIES       | Topic-based groups; each has one moderator                          |
| COMMUNITY_MEMBERS | Junction table for many-to-many User ↔ Community membership        |
| POSTS             | Polymorphic post table; `type` column differentiates subtypes       |
| POLL_OPTIONS      | Options belonging to a POLL type post                               |
| POLL_VOTES        | Tracks which user voted for which poll option                       |
| TAGS              | Flat tag list; linked to posts via POST_TAGS junction table         |
| POST_TAGS         | Junction table for many-to-many Post ↔ Tag                         |
| COMMENTS          | Comments and nested replies (self-referencing via parent_comment_id)|
| VOTES             | Generic vote table for both posts and comments (polymorphic FK)     |
| NOTIFICATIONS     | In-app notification records per user                               |
| AUDIT_LOGS        | Admin-visible log of all moderation and admin actions               |

## Constraints & Indexes

- `VOTES(voter_id, target_id, target_type)` — UNIQUE constraint to prevent duplicate votes
- `POLL_VOTES(post_id, user_id)` — UNIQUE constraint to prevent double poll voting
- `POSTS(community_id)`, `POSTS(author_id)`, `COMMENTS(post_id)` — indexed for fast feed queries
- `NOTIFICATIONS(recipient_id, is_read)` — indexed for unread notification lookups
