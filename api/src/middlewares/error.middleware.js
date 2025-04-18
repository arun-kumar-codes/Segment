import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

// Custom error class for API errors
export class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Handle Prisma errors
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'A record with this data already exists'
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }
    }

    if (err instanceof PrismaClientValidationError) {
        return res.status(400).json({
            success: false,
            message: 'Invalid data provided',
            errors: [err.message]
        });
    }

    // Handle our custom API errors
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    // Handle other errors
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// Not found middleware
export const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Not Found - ${req.originalUrl}`
    });
}; 