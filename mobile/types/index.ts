export interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bannerImage?: string;
  bio?: string;
  location?: string;
  followers?: User[];
  following?: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  user: User;
  likes: string[];
  comments: Comment[];
}

export interface Notification {
  _id: string;
  from: {
    userName: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  to: string;
  type: "like" | "comment" | "follow";
  post?: {
    _id: string;
    content: string;
    image?: string;
  };
  comment?: {
    _id: string;
    content: string;
  };
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  receiver: User;
  content: string;
  messageType: "text" | "image";
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt: string;
  unreadCount: Map<string, number>;
  createdAt: string;
  updatedAt: string;
}
