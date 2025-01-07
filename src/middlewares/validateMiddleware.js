const { body, param, validationResult } = require('express-validator');

exports.validateSignup = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['job_seeker', 'employer']).withMessage('Invalid role'),
  validate
];

exports.validateProfileUpdate = [
  body('profile.name').optional().isString().withMessage('Name must be a string'),
  body('profile.age').optional().isInt({ min: 18, max: 120 }).withMessage('Age must be between 18 and 120'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  // Add more validations as needed
  validate
];

exports.validateJobCreation = [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('skillsRequired').isArray({ min: 1 }).withMessage('At least one skill is required'),
  // Additional validations for location, budget, etc.
  validate
];

exports.validateJobApplication = [
  param('jobId').isMongoId().withMessage('Invalid job ID'),
  body('pitch').notEmpty().withMessage('Pitch is required'),
  body('rate').isNumeric().withMessage('Rate must be a number'),
  validate
];

exports.validateJobSelection = [
  body('jobId').isMongoId().withMessage('Invalid job ID'),
  body('providerId').isMongoId().withMessage('Invalid provider ID'),
  validate
];

exports.validateReview = [
  body('jobId').isMongoId().withMessage('Invalid job ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string'),
  validate
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}