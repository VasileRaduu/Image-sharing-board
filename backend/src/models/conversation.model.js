import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Ensure participants array has exactly 2 users
conversationSchema.pre("save", function(next) {
  if (this.participants.length !== 2) {
    return next(new Error("Conversation must have exactly 2 participants"));
  }
  next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
