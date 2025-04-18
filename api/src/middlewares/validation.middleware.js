import { body, param, query, validationResult } from 'express-validator';

// Helper function to handle validation errors
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// Segment validation rules
export const createSegmentValidation = [
    body('segmentName').notEmpty().withMessage('Segment name is required'),
    body('owner').notEmpty().withMessage('Owner is required'),
    body('degreeTypes').isArray().optional(),
    body('jobSeekingInterests').isArray().optional(),
    body('majorCategory').isIn(['STEAM', 'TEMOnly', 'LiberalArts']).optional(),
    body('gpaMin').isFloat({ min: 0.0, max: 4.0 }).optional(),
    body('gpaMax').isFloat({ min: 0.0, max: 4.0 }).optional(),
    body('workExperience').isArray().optional(),
    body('workExperience.*.jobTitle').notEmpty().withMessage('Job title is required').optional(),
    body('workExperience.*.company').notEmpty().withMessage('Company is required').optional(),
    validateRequest
];

export const updateSegmentStatusValidation = [
    query('id').notEmpty().withMessage('Segment ID is required'),
    body('IsActive').isBoolean().withMessage('IsActive must be a boolean'),
    validateRequest
];

export const getSegmentsValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('active').optional().isBoolean(),
    validateRequest
]; 