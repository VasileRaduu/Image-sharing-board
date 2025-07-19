import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxLength: 280,
    },
    image: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

// Create indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 }); // For user posts queries
postSchema.index({ createdAt: -1 }); // For general posts queries
postSchema.index({ content: 'text' }); // For text search
postSchema.index({ likes: 1 }); // For like queries

const Post = mongoose.model("Post", postSchema);

export default Post;