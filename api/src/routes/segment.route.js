import { Router } from 'express';
import {
    createSegment,
    getSegments,
    updateSegmentStatus,
    getSegmentById
} from '../controllers/segment.controller.js';
import {
    createSegmentValidation,
    getSegmentsValidation,
    updateSegmentStatusValidation
} from '../middlewares/validation.middleware.js';

const segmentRoute = Router();

// Create new segment
segmentRoute.post('/create', createSegmentValidation, createSegment);

// Get segments with pagination
segmentRoute.get('/get', getSegmentsValidation, getSegments);

// Update segment status
segmentRoute.put('/update', updateSegmentStatusValidation, updateSegmentStatus);

// Get segment by ID
segmentRoute.get('/:id', getSegmentById);

export default segmentRoute;
