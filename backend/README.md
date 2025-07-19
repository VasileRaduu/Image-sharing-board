# Image Sharing Board Backend

A robust Node.js + Express backend for the Image Sharing Board application with enhanced security, performance, and scalability features.

## 🚀 Features

- **Authentication**: Secure Clerk integration
- **File Upload**: Cloudinary integration with image optimization
- **Rate Limiting**: Arcjet protection against abuse
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, input sanitization
- **Performance**: Database indexing, pagination, caching
- **Testing**: Jest test suite
- **Documentation**: Comprehensive API documentation

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Clerk account
- Cloudinary account
- Arcjet account

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd image-sharing-board/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your configuration values.

4. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable                | Description                          | Required |
| ----------------------- | ------------------------------------ | -------- |
| `PORT`                  | Server port                          | Yes      |
| `NODE_ENV`              | Environment (development/production) | Yes      |
| `MONGO_URI`             | MongoDB connection string            | Yes      |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key                | Yes      |
| `CLERK_SECRET_KEY`      | Clerk secret key                     | Yes      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                | Yes      |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                   | Yes      |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                | Yes      |
| `ARCJET_KEY`            | Arcjet API key                       | Yes      |

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── __tests__/           # Test files
├── package.json
└── README.md
```

## 🔐 Security Features

- **Authentication**: Clerk-based user authentication
- **Authorization**: Route protection middleware
- **Input Validation**: Express-validator with sanitization
- **File Upload Security**: Multer with file type validation
- **Rate Limiting**: Arcjet integration
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Sanitization**: XSS protection

## 📊 Performance Optimizations

- **Database Indexing**: Optimized queries for posts, users, comments
- **Pagination**: Efficient data loading
- **Image Optimization**: Cloudinary transformations
- **Caching**: Response caching strategies
- **Query Optimization**: Lean queries and selective population

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

Comprehensive API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Key Endpoints

- `GET /api/posts` - Get all posts with pagination
- `POST /api/posts` - Create a new post
- `GET /api/users/profile/:username` - Get user profile
- `POST /api/comments/:postId` - Create a comment
- `GET /api/search` - Search posts and users

## 🔄 Database Schema

### User Model

- Authentication via Clerk
- Profile information (name, bio, location)
- Follow/following relationships
- Profile and banner images

### Post Model

- Content and image support
- User relationships
- Like and comment arrays
- Timestamps

### Comment Model

- Content and user relationships
- Post associations
- Like functionality

### Notification Model

- Follow, like, and comment notifications
- User relationships
- Post and comment references

## 🚀 Deployment

### Vercel Deployment

The backend is configured for Vercel deployment with `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

### Environment Setup

1. Set up environment variables in your deployment platform
2. Configure CORS origins for production
3. Set up MongoDB Atlas for production database
4. Configure Cloudinary for production image storage

## 🔧 Development

### Code Quality

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type safety (optional)

### Debugging

```bash
# Start with debugging
node --inspect src/server.js
```

### Database Management

```bash
# Connect to MongoDB
mongosh "your-mongodb-uri"

# View collections
show collections

# Query data
db.posts.find().limit(5)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Review the test files for usage examples
3. Open an issue on GitHub

## 🔄 Changelog

### v1.0.0

- Initial release with core functionality
- Authentication and authorization
- Post and comment management
- File upload capabilities
- Search functionality
- Notification system
