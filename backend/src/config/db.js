import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
	try {
		// Check if MONGO_URI is provided
		if (!ENV.MONGO_URI) {
			console.error("❌ MONGO_URI is not defined in environment variables");
			console.log("Please add MONGO_URI to your .env file");
			process.exit(1);
		}

		console.log("🔌 Attempting to connect to MongoDB Atlas...");
		
		// Hide password in logs for security
		const sanitizedUri = ENV.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
		console.log("📡 Connection string:", sanitizedUri);
		
		await mongoose.connect(ENV.MONGO_URI, {
			// Connection options optimized for Atlas
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 30000, // 30 seconds for Atlas
			socketTimeoutMS: 45000,
		});
		
		console.log("✅ Connected to MongoDB Atlas Successfully");
		console.log("📊 Database:", mongoose.connection.name);
		console.log("🌐 Host:", mongoose.connection.host);
		console.log("🔢 Port:", mongoose.connection.port);
		
		// Test the connection
		await mongoose.connection.db.admin().ping();
		console.log("�� Database ping successful");
		
	} catch (error) {
		console.error("❌ Error connecting to MongoDB Atlas:");
		console.error("   Error:", error.message);
		
		if (error.name === "MongoNetworkError") {
			console.error("   💡 Check your internet connection and Atlas cluster status");
			console.error("   💡 Verify your IP address is whitelisted in Atlas");
		} else if (error.name === "MongoParseError") {
			console.error("   💡 Check your MONGO_URI format");
		} else if (error.name === "MongoServerSelectionError") {
			console.error("   💡 Check your username/password in the connection string");
		}
		
		process.exit(1);
	}
};
