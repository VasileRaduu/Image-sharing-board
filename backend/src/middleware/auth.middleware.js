import { getAuth } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return res.status(401).json({ 
				error: "Unauthorized", 
				message: "You must be logged in to access this resource" 
			});
		}
		next();
	} catch (error) {
		console.error("Authentication error:", error);
		return res.status(401).json({ 
			error: "Authentication failed", 
			message: "Invalid or expired authentication token" 
		});
	}
};