import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	// Check MIME type
	if (!file.mimetype.startsWith("image/")) {
		return cb(new Error("Only image files are allowed"), false);
	}

	// Check file extension
	const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
	const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
	
	if (!allowedExtensions.includes(fileExtension)) {
		return cb(new Error("Invalid file type. Only JPG, PNG, GIF, and WebP are allowed"), false);
	}

	// Check for potential security issues
	if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
		return cb(new Error("Invalid filename"), false);
	}

	cb(null, true);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
		files: 1, // Only allow 1 file per request
		fieldSize: 1024 * 1024 // 1MB field size limit
	}
});

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		if (error.code === 'LIMIT_FILE_SIZE') {
			return res.status(413).json({
				error: "File too large",
				message: "File size must be less than 5MB"
			});
		}
		if (error.code === 'LIMIT_FILE_COUNT') {
			return res.status(400).json({
				error: "Too many files",
				message: "Only one file is allowed per request"
			});
		}
		return res.status(400).json({
			error: "Upload error",
			message: error.message
		});
	}
	
	if (error.message) {
		return res.status(400).json({
			error: "Invalid file",
			message: error.message
		});
	}
	
	next(error);
};

export default upload;