# Image Sharing Board 📸

A modern, full-stack image sharing application built with React Native (Expo) and Node.js. Share photos, connect with others, and engage through comments and notifications in a beautiful, responsive interface.

## ✨ Features

### 📱 Mobile App (React Native + Expo)

- **Social Feed**: Browse and interact with shared images
- **Image Sharing**: Upload and share photos with captions
- **User Authentication**: Secure login with Clerk authentication
- **Real-time Updates**: Pull-to-refresh and live content updates
- **User Profiles**: Customizable profiles with bio and location
- **Comments System**: Engage with posts through comments
- **Notifications**: Stay updated with real-time notifications
- **Search & Discovery**: Find users and content easily
- **Modern UI**: Beautiful interface with Tailwind CSS styling

### 🖥️ Backend API (Node.js + Express)

- **RESTful API**: Clean, well-structured endpoints
- **MongoDB Integration**: Scalable data storage
- **Image Upload**: Cloudinary integration for image hosting
- **Rate Limiting**: Arcjet protection against abuse
- **Authentication**: Clerk middleware for secure routes
- **Real-time Features**: WebSocket support for live updates

## 🛠️ Tech Stack

### Frontend (Mobile)

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **Clerk** - Authentication and user management
- **Expo Router** - File-based routing

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Cloudinary** - Cloud image management
- **Clerk** - Authentication middleware
- **Arcjet** - Rate limiting and security
- **Multer** - File upload handling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- MongoDB database
- Clerk account for authentication
- Cloudinary account for image storage

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/image-sharing-board.git
   cd image-sharing-board
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLERK_SECRET_KEY=your_clerk_secret_key
   ARCJET_KEY=your_arcjet_key
   ```

   Start the backend server:

   ```bash
   npm run dev
   ```

3. **Mobile App Setup**

   ```bash
   cd mobile
   npm install
   ```

   Create a `.env` file in the mobile directory:

   ```env
   EXPO_PUBLIC_API_URL=http://localhost:5000
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

   Start the mobile app:

   ```bash
   npm start
   ```

### Development Scripts

**Backend:**

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server

**Mobile:**

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
image-sharing-board/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Database, environment config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── server.js       # Express app entry
│   └── package.json
├── mobile/                  # React Native app
│   ├── app/                # Expo Router pages
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/users/sync` - Sync user data with Clerk

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Like/unlike post

### Comments

- `GET /api/comments/:postId` - Get comments for post
- `POST /api/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🎨 Key Features Implementation

### Image Upload

- Uses Expo Image Picker for camera/gallery access
- Cloudinary integration for cloud storage
- Automatic image optimization and resizing

### Real-time Updates

- React Query for efficient data fetching
- Pull-to-refresh functionality
- Optimistic updates for better UX

### Authentication Flow

- Clerk integration for secure authentication
- Automatic user synchronization
- Protected routes and API endpoints

## 🚀 Deployment

### Backend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Mobile App

1. **Expo Application Services (EAS)**

   ```bash
   npm install -g @expo/eas-cli
   eas build --platform all
   eas submit
   ```

2. **Manual Build**
   ```bash
   expo build:android
   expo build:ios
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Clerk](https://clerk.com/) for authentication services
- [Cloudinary](https://cloudinary.com/) for image management
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React Native, Node.js, and modern web technologies**
