import { body, param, query } from 'express-validator';

// Sanitize and validate common input fields
export const sanitizeInput = [
  body('content').trim().escape(),
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  body('bio').trim().escape(),
  body('location').trim().escape(),
  param('postId').trim(),
  param('commentId').trim(),
  param('userId').trim(),
  param('username').trim().toLowerCase(),
  query('q').trim().escape(),
  query('page').toInt(),
  query('limit').toInt()
];

// Sanitize search queries specifically
export const sanitizeSearch = [
  query('q')
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
];

// Sanitize pagination parameters
export const sanitizePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
];

// Remove potentially dangerous characters and normalize input
export const cleanInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .normalize('NFD') // Normalize unicode
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
};

// Middleware to clean request body
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = cleanInput(req.body[key]);
      }
    });
  }
  next();
};

// Middleware to clean query parameters
export const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = cleanInput(req.query[key]);
      }
    });
  }
  next();
}; 