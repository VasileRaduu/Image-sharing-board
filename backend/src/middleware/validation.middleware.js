import { body, validationResult } from 'express-validator';
import { ApiResponse, formatValidationErrors } from '../utils/responseHelper.js';

export const validatePost = [
  body('content')
    .optional()
    .trim()
    .isLength({ max: 280 })
    .withMessage('Content must be less than 280 characters'),
  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a valid string'),
];

export const validateComment = [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
];

export const validateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Bio must be less than 200 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
];

export const validateSearch = [
  body('query')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.badRequest(
      res, 
      'Validation failed', 
      formatValidationErrors(errors.array())
    );
  }
  next();
}; 