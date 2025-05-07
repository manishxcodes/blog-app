#  Blog App

A modern full-stack blog application where users can sign up, create blogs, explore others' content, and bookmark their favorite posts. Built with performance and scalability in mind using Cloudflare Workers and Hono.js on the backend, and React with Tailwind CSS on the frontend.

##  Tech Stack

### Backend
- **Cloudflare Workers** — Serverless deployment
- **Hono.js** — Lightweight web framework
- **TypeScript** — Type safety
- **Prisma + Accelerate** — Type-safe ORM and accelerated queries
- **PostgreSQL** — Relational database
- **JWT Auth** — Secure user authentication
- **Cloudinary** — Image upload and management

### Frontend
- **React** 
- **Tailwind CSS** — Utility-first styling
- **React Router** — Routing
- **Debounced Bookmark Updates** — Optimized UX

## Features

- User Signup and Signin (JWT-based)
- Create, Read, and View Blogs
- Bookmark and Manage Favorite Posts
- Fast serverless backend (Hono + Cloudflare Workers)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blog-app.git
cd blog-app

cd backend
npm install

# Create a `.env` file with:
# DATABASE_URL=<your postgres database url>

npx prisma generate
npx prisma db push
npm run dev

cd frontend
npm install
npm run dev
```

---
---

### POST `/api/v1/user/signup`

Registers a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "user123",
  "name": "User Name"
} 
```

**Response**:
```json
{
  "message": "User Created Successfully"
}
```
---

### POST `/api/v1/user/signin`

Logs in a registered user and returns a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
**Response**:

```json
{
  "token": "your_jwt_token_here"
}
```
---

### GET `/api/v1/blog`

Fetches all published blog posts along with author names and bookmark status for the authenticated user.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "formattedPosts": [
    {
      "id": "post_id_1",
      "title": "Post Title",
      "content": "Post content...",
      "published": true,
      "createdAt": "2024-12-01T12:00:00.000Z",
      "authorName": "Author Name",
      "isBookmarked": true
    }
  ]
}
```

---

### POST `/api/v1/blog`

Creates a new blog post for the authenticated user.

**Request Body (Form Data):**
```json
{
  "title": "Your Post Title",
  "content": "Content of the blog post...",
  "published": true
}
```

**Response (on success):**
```json
{
  "message": "Successfully posted the blog",
  "blog": {
    "id": "post_id",
    "title": "Post Title",
    "content": "Post content...",
    "published": true,
    "authorId": "user_id",
    "createdAt": "2024-12-01T12:00:00.000Z"
  }
}
```

**Error (if validation fails):**
```json
{
  "error": [
    "Title is required",
    "Content is required"
  ]
}
```

**Error (on internal server error):**
```json
{
  "error": "Something went wrong.",
  "err": "Error details"
}
```


---

### GET `/api/v1/blog/user`

Fetches all blog posts created by the authenticated user.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (when posts exist):**
```json
{
  "Posts": [
    {
      "id": "post_id_1",
      "title": "Your Post Title",
      "content": "Your post content...",
      "published": true,
      "createdAt": "2024-12-01T12:00:00.000Z",
      "author": {
        "name": "Your Name"
      }
    }
  ]
}
```

**Response (when no posts exist):**
```json
{
  "message": "No Posts"
}
```

---

### GET `/api/v1/blog/:id`

Fetches a specific blog post by its ID.

**Path Parameter:**
- `id` – the ID of the blog post

**Response:**
```json
{
  "post": {
    "id": "post_id_1",
    "title": "Specific Post Title",
    "content": "Content of the specific post...",
    "createdAt": "2024-12-01T12:00:00.000Z",
    "author": {
      "name": "Author Name"
    }
  }
}
```

**Error (if ID is missing):**
```json
{
  "error": "Blog ID is required"
}
```

**Error (if post not found):**
```json
{
  "error": "Something went wrong. Unable to get the post"
}
```
 ---
 ### PUT `/api/v1/blog/update`

Updates an existing blog post for the authenticated user.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Form Data:**
- `title` – New title for the blog post (string)
- `content` – New content for the blog post (string)
- `blogId` – The ID of the blog post to update (string)

**Response (on successful update):**
```json
{
  "message": "Successfully Updated",
  "updatedPost": {
    "id": "post_id_1",
    "title": "Updated Post Title",
    "content": "Updated post content...",
    "published": true,
    "createdAt": "2024-12-01T12:00:00.000Z",
    "authorId": "user_id_1"
  }
}
```

**Error (if blog ID is missing):**
```json
{
  "error": "Blog ID is missing"
}
```

**Error (if Zod validation fails):**
```json
{
  "error": ["Title is required", "Content is required"]
}
```

**Error (if the post does not belong to the authenticated user or the post is not found):**
```json
{
  "message": "Blog not found"
}
```

**Error (on internal server error):**
```json
{
  "error": "Something went wrong",
  "err": "Error details"
}
```
--- 

### POST `/api/v1/bookmark/:id`

Adds a blog post to the authenticated user's bookmarks.

**Request Parameters:**
- `id` (required): The ID of the blog post to be bookmarked.

**Response (on success):**
```json
{
  "message": "Blog bookmarked successfully",
  "bookmarks": [
    {
      "id": "bookmark_id",
      "title": "Post Title",
      "content": "Post content...",
      "author": {
        "name": "Author Name"
      },
      "createdAt": "2024-12-01T12:00:00.000Z"
    }
  ]
}
```

**Error (if blogId is not provided):**
```json
{
  "error": "Blog Id is required"
}
```

**Error (if blog not found):**
```json
{
  "error": "Blog not found"
}
```

**Error (if already bookmarked):**
```json
{
  "message": "This blog is already bookmarked"
}
```

**Error (on internal server error):**
```json
{
  "error": "Something went wrong",
  "err": "Error details"
}
```


---

### GET `/api/v1/user/bookmarks`

Fetches all the bookmarks of the authenticated user.

**Response (on success):**
```json
{
  "bookmarks": [
    {
      "id": "post_id_1",
      "title": "Post Title",
      "content": "Post content...",
      "author": {
        "name": "Author Name"
      },
      "createdAt": "2024-12-01T12:00:00.000Z"
    },
    {
      "id": "post_id_2",
      "title": "Another Post Title",
      "content": "Another post content...",
      "author": {
        "name": "Another Author"
      },
      "createdAt": "2024-12-02T12:00:00.000Z"
    }
  ]
}
```

**Response (if no bookmarks found):**
```json
{
  "message": "No bookmarks"
}
```

**Error (on internal server error):**
```json
{
  "error": "something went wrong",
  "err": "Error details"
}
```

---

### GET `/api/v1/blog/:id/bookmark/check`

Checks if a specific blog post is already bookmarked by the authenticated user.

**Response (if the post is already bookmarked):**
```json
{
  "bookmarked": true
}
```

**Response (if the post is not bookmarked):**
```json
{
  "bookmarked": false
}
```

**Error (if Blog ID is missing):**
```json
{
  "error": "Blog ID is required"
}
```

**Error (if the blog is not found):**
```json
{
  "error": "Blog not found"
}
```

**Error (on internal server error):**
```json
{
  "error": "Something went wrong",
  "err": "Error details"
}
```

---

### DELETE `/api/v1/blog/:id/bookmark/remove`

Removes a specific blog post from the user's bookmarks.

**Response (on success):**
```json
{
  "message": "Post removed from bookmarks successfully",
  "bookmarks": [
    {
      "id": "post_id_1",
      "title": "Post Title",
      "content": "Post content..."
    }
  ]
}
```

**Response (if the post is not bookmarked):**
```json
{
  "message": "Post is not bookmarked, cannot remove"
}
```

**Response (if Blog ID is missing):**
```json
{
  "message": "Blog ID required"
}
```

**Response (if the blog is not found):**
```json
{
  "error": "Blog not found"
}
```

**Response (if the user is unauthorized to remove the bookmark):**
```json
{
  "message": "Unauthorized to remove bookmarks"
}
```

**Error (on internal server error):**
```json
{
  "error": "Something went wrong",
  "err": "Error details"
}
```
---

### DELETE `/api/v1/blog/:id`

Deletes a blog post by its ID. The blog post must belong to the authenticated user.

**Response (on success):**
```json
{
  "message": "Blog post deleted successfully",
  "deletedPost": {
    "id": "post_id",
    "title": "Post Title",
    "content": "Post content...",
    "createdAt": "2024-12-01T12:00:00.000Z"
  }
}
```

**Error (if Blog ID is missing):**
```json
{
  "error": "Blog Id is required"
}
```

**Error (if Blog not found):**
```json
{
  "error": "Blog not found"
}
```

**Error (if the user is unauthorized to delete the blog):**
```json
{
  "error": "Unauthorised to delete this blog"
}
```

**Error (on internal server error):**
```json
{
  "error": "An error occured while deleting the post",
  "err": "Error details"
}
```

