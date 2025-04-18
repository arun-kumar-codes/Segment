/**
 * Standard success response format
 * 
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Response object
 */
export const successResponse = (res, statusCode = 200, data = null, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Standard error response format
 * 
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Array} errors - Array of detailed errors
 * @returns {Object} Response object
 */
export const errorResponse = (res, statusCode = 500, message = 'Error', errors = []) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};

/**
 * Standard pagination response format
 * 
 * @param {Object} res - Express response object
 * @param {Array} data - Paginated data array
 * @param {number} totalCount - Total record count
 * @param {number} page - Current page number
 * @param {number} limit - Records per page
 * @param {string} message - Success message
 * @returns {Object} Response object
 */
export const paginatedResponse = (
    res,
    data = [],
    totalCount = 0,
    page = 1,
    limit = 10,
    message = 'Success'
) => {
    return res.status(200).json({
        success: true,
        message,
        data,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
    });
}; 