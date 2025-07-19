import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 280,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Create indexes for better query performance
commentSchema.index({ post: 1, createdAt: -1 }); // For post comments queries
commentSchema.index({ user: 1, createdAt: -1 }); // For user comments queries
commentSchema.index({ content: 'text' }); // For text search

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;