import { SegmentService } from '../services/segment.service.js';
import { successResponse, paginatedResponse } from '../utils/response.util.js';
import { ApiError } from '../middlewares/error.middleware.js';

/**
 * Create a new segment
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createSegment = async (req, res, next) => {
    try {
        const segmentData = req.body;
        const createdSegment = await SegmentService.createSegment(segmentData);
        return successResponse(res, 201, createdSegment, "Segment created successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Get paginated segments
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getSegments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const active = req.query.active === 'false' ? false : true;

        const { segments, totalCount } = await SegmentService.getSegments({
            page,
            limit,
            active
        });

        return paginatedResponse(res, segments, totalCount, page, limit);
    } catch (error) {
        next(error);
    }
};

/**
 * Update segment active status
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateSegmentStatus = async (req, res, next) => {
    try {
        const { id } = req.query;
        const { IsActive } = req.body;

        const updatedSegment = await SegmentService.updateSegmentStatus(id, IsActive);
        return successResponse(res, 200, updatedSegment, "Segment status updated successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Get segment by ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getSegmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, "Segment ID is required");
        }

        const segment = await SegmentService.getSegmentById(id);
        return successResponse(res, 200, segment);
    } catch (error) {
        next(error);
    }
};
