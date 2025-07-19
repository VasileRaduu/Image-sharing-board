import mongoose from "mongoose";

const uri = "mongodb+srv://imageboard_user:ImageBoard2024!@cluster0.5yt9t9z.mongodb.net/pixly_db?retryWrites=true&w=majority&appName=Cluster0";

console.log("Testing connection...");

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connection successful!");
    process.exit(0);
  })
  .catch(err => {
    console.log("❌ Connection failed:", err.message);
    process.exit(1);
  });
