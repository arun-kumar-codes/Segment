import { Router } from 'express';
import  { createSegment, getSegments, updateSegmentStatus } from '../controllers/segment.controller.js';

const segmentRoute  = Router();


segmentRoute.post('/create', createSegment);
segmentRoute.get('/get', getSegments);
segmentRoute.put('/update', updateSegmentStatus);
export default segmentRoute;
