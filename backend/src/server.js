import express from "express";
import cors from "cors";
import {clerkMiddleware} from "@clerk/express";
import { securityMiddleware, corsOptions } from "./middleware/security.middleware.js";
import { performanceMiddleware, requestSizeMiddleware } from "./middleware/performance.middleware.js";
import { sanitizeBody, sanitizeQuery } from "./middleware/sanitization.middleware.js";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import searchRoutes from "./routes/search.route.js";
import messageRoutes from "./routes/message.route.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";
import { ApiResponse } from "./utils/responseHelper.js";

const app = express();

app.use(securityMiddleware);
app.use(cors(corsOptions));
app.use(performanceMiddleware);
app.use(requestSizeMiddleware);
app.use(express.json({ limit: '10mb' }));

// Sanitization middleware
app.use(sanitizeBody);
app.use(sanitizeQuery);

app.use(clerkMiddleware());

app.get("/",(req,res) => res.send("Hello from server"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/messages", messageRoutes);

// error handling middleware
app.use((err, req, res, next) => {
	console.error("Unhandled error:", err);
	ApiResponse.internalError(res, err.message || "Internal server error");
});

const startServer = async () => {
	try {
		await connectDB();

		//listen for local development
		if(ENV.NODE_ENV !=="production") {
			app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
		}
	} catch (error) {
		console.error("Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();

//export for vercel
export default app;
