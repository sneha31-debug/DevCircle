# Sequence Diagram – DevCircle

## Main Flow: User Creates a Post and Receives a Notification

This sequence covers the most complete end-to-end flow in the system:
a logged-in Member creates a Question post, another Member comments on it,
and the original author receives a notification — demonstrating Auth, Factory, Repository, and Observer patterns in one flow.

---

## Diagram

```mermaid
sequenceDiagram
    actor Author as Member (Author)
    actor Viewer as Member (Viewer)
    participant Client as React Client
    participant AuthMW as Auth Middleware
    participant PostCtrl as PostController
    participant PostSvc as PostService
    participant PostFactory as PostFactory
    participant PostRepo as PostRepository
    participant DB as PostgreSQL
    participant EventBus as EventBus (Observer)
    participant NotifSvc as NotificationService
    participant NotifRepo as NotificationRepository

    Note over Author,Client: 1. Login
    Author->>Client: Submit login form
    Client->>AuthMW: POST /api/auth/login { email, password }
    AuthMW->>DB: SELECT user WHERE email = ?
    DB-->>AuthMW: User record
    AuthMW->>AuthMW: bcrypt.compare(password, hash)
    AuthMW-->>Client: 200 OK + JWT token

    Note over Author,DB: 2. Create a Question Post
    Author->>Client: Fill Create Post form (type = question)
    Client->>PostCtrl: POST /api/posts { title, body, type, tags, communityId } + JWT
    PostCtrl->>AuthMW: Validate JWT
    AuthMW-->>PostCtrl: Decoded { userId, role }
    PostCtrl->>PostSvc: createPost(userId, dto)
    PostSvc->>PostFactory: create("question", dto)
    PostFactory->>PostFactory: Instantiate QuestionPost subclass
    PostFactory-->>PostSvc: QuestionPost instance
    PostSvc->>PostRepo: save(questionPost)
    PostRepo->>DB: INSERT INTO posts + post_tags
    DB-->>PostRepo: Saved post { id }
    PostRepo-->>PostSvc: Persisted QuestionPost
    PostSvc->>EventBus: emit("POST_CREATED", { postId, authorId })
    PostSvc-->>PostCtrl: Post DTO
    PostCtrl-->>Client: 201 Created { post }
    Client-->>Author: Post visible in feed

    Note over Viewer,DB: 3. Viewer Adds a Comment
    Viewer->>Client: Write and submit comment
    Client->>PostCtrl: POST /api/posts/:postId/comments { body } + JWT
    PostCtrl->>AuthMW: Validate JWT
    AuthMW-->>PostCtrl: Decoded { viewerId, role }
    PostCtrl->>PostSvc: addComment(viewerId, postId, body)
    PostSvc->>PostRepo: saveComment(comment)
    PostRepo->>DB: INSERT INTO comments
    DB-->>PostRepo: Saved comment
    PostRepo-->>PostSvc: Comment record
    PostSvc->>EventBus: emit("COMMENT_ADDED", { postId, commenterId, authorId })
    PostSvc-->>PostCtrl: Comment DTO
    PostCtrl-->>Client: 201 Created { comment }
    Client-->>Viewer: Comment shown on post

    Note over EventBus,DB: 4. Observer Creates Notification
    EventBus->>NotifSvc: on("COMMENT_ADDED") fires
    NotifSvc->>NotifSvc: Build notification { recipientId: authorId, type: NEW_COMMENT }
    NotifSvc->>NotifRepo: save(notification)
    NotifRepo->>DB: INSERT INTO notifications
    DB-->>NotifRepo: Saved

    Note over Author,Client: 5. Author Reads Notification
    Author->>Client: Open notifications panel
    Client->>PostCtrl: GET /api/notifications + JWT
    PostCtrl->>NotifSvc: getUnread(authorId)
    NotifSvc->>NotifRepo: findByRecipient(authorId, unread=true)
    NotifRepo->>DB: SELECT * FROM notifications WHERE recipient_id = ? AND read = false
    DB-->>NotifRepo: Notification records
    NotifRepo-->>NotifSvc: Notification[]
    NotifSvc-->>PostCtrl: Notification DTOs
    PostCtrl-->>Client: 200 OK [{ type, message, createdAt }]
    Client-->>Author: "Viewer commented on your post"
```

---

## Flow Summary

| Step | Description                          | Pattern / Principle   |
|------|--------------------------------------|-----------------------|
| 1    | JWT login and token verification     | Auth Middleware       |
| 2    | Post creation with type dispatch     | Factory Pattern       |
| 3    | Data persistence through repository  | Repository Pattern    |
| 4    | Event emitted after business logic   | Observer Pattern      |
| 5    | Notification created asynchronously  | Observer / Service    |
| 6    | Author retrieves unread notifications| Repository Pattern    |
