# Image Sharing Board API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require authentication via Clerk. Include the authentication token in the request headers.

## Response Format

All API responses follow a standardized format:

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": [],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Posts

#### GET /api/posts

Get all posts with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [
      {
        "_id": "post_id",
        "content": "Post content",
        "image": "image_url",
        "user": {
          "_id": "user_id",
          "username": "username",
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "profile_url"
        },
        "likes": ["user_id"],
        "comments": ["comment_id"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### GET /api/posts/:postId

Get a specific post by ID.

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "post": {
      "_id": "post_id",
      "content": "Post content",
      "image": "image_url",
      "user": {
        "_id": "user_id",
        "username": "username",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "profile_url"
      },
      "likes": ["user_id"],
      "comments": [
        {
          "_id": "comment_id",
          "content": "Comment content",
          "user": {
            "_id": "user_id",
            "username": "username",
            "firstName": "John",
            "lastName": "Doe",
            "profilePicture": "profile_url"
          }
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### GET /api/posts/user/:username

Get all posts by a specific user.

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "posts": [
      {
        "_id": "post_id",
        "content": "Post content",
        "image": "image_url",
        "user": {
          "_id": "user_id",
          "username": "username",
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "profile_url"
        },
        "likes": ["user_id"],
        "comments": ["comment_id"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### POST /api/posts

Create a new post. **Protected Route**

**Request Body:**

```json
{
  "content": "Post content (optional if image provided)"
}
```

**Form Data:**

- `image` (optional): Image file (max 5MB, formats: JPG, PNG, GIF, WebP)

**Response:**

```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "post": {
      "_id": "post_id",
      "content": "Post content",
      "image": "image_url",
      "user": "user_id",
      "likes": [],
      "comments": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /api/posts/:postId/like

Like or unlike a post. **Protected Route**

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Post liked successfully"
  }
}
```

#### DELETE /api/posts/:postId

Delete a post. **Protected Route**

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Post deleted successfully"
  }
}
```

### Users

#### GET /api/users/profile/:username

Get a user's profile.

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "user_id",
      "clerkId": "clerk_user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userName": "username",
      "profilePicture": "profile_url",
      "bannerImage": "banner_url",
      "bio": "User bio",
      "location": "User location",
      "followers": ["user_id"],
      "following": ["user_id"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /api/users/sync

Sync user data from Clerk. **Protected Route**

**Response:**

```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "clerkId": "clerk_user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userName": "username",
      "profilePicture": "profile_url",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "message": "User created successfully"
  }
}
```

#### GET /api/users/me

Get current user's profile. **Protected Route**

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "user_id",
      "clerkId": "clerk_user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userName": "username",
      "profilePicture": "profile_url",
      "bio": "User bio",
      "location": "User location",
      "followers": ["user_id"],
      "following": ["user_id"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT /api/users/profile

Update user profile. **Protected Route**

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "location": "Updated location"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Updated bio",
      "location": "Updated location",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /api/users/follow/:targetUserId

Follow or unfollow a user. **Protected Route**

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "User followed successfully"
  }
}
```

### Comments

#### GET /api/comments/:postId

Get all comments for a post.

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "comments": [
      {
        "_id": "comment_id",
        "content": "Comment content",
        "user": {
          "_id": "user_id",
          "username": "username",
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "profile_url"
        },
        "post": "post_id",
        "likes": ["user_id"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### POST /api/comments/:postId

Create a new comment. **Protected Route**

**Request Body:**

```json
{
  "content": "Comment content"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "comment": {
      "_id": "comment_id",
      "content": "Comment content",
      "user": "user_id",
      "post": "post_id",
      "likes": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### DELETE /api/comments/:commentId

Delete a comment. **Protected Route**

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Comment deleted"
  }
}
```

### Notifications

#### GET /api/notifications

Get user's notifications. **Protected Route**

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "notifications": [
      {
        "_id": "notification_id",
        "from": {
          "_id": "user_id",
          "username": "username",
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "profile_url"
        },
        "to": "user_id",
        "type": "like",
        "post": {
          "_id": "post_id",
          "content": "Post content",
          "image": "image_url"
        },
        "comment": {
          "_id": "comment_id",
          "content": "Comment content"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### DELETE /api/notifications/:notificationId

Delete a notification. **Protected Route**

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Notification deleted successfully"
  }
}
```

### Search

#### GET /api/search

Search for posts and users. **Protected Route**

**Query Parameters:**

- `q` (required): Search query
- `type` (optional): Search type ('posts', 'users', or both)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "posts": [
      {
        "_id": "post_id",
        "content": "Post content",
        "user": {
          "_id": "user_id",
          "username": "username",
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "profile_url"
        }
      }
    ],
    "users": [
      {
        "_id": "user_id",
        "username": "username",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "profile_url"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalResults": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## Error Codes

- `400` - Bad Request: Invalid input data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `409` - Conflict: Resource already exists
- `413` - Payload Too Large: File size exceeds limit
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server error

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Post creation: 3 posts per minute
- Comment creation: 10 comments per minute

## File Upload

- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF, WebP
- Images are automatically optimized and stored on Cloudinary
