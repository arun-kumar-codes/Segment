import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middlewares/error.middleware.js';

const prisma = new PrismaClient();

/**
 * Service layer for segment operations
 */
export const SegmentService = {
    /**
     * Create a new segment
     * 
     * @param {Object} data - Segment data
     * @returns {Promise<Object>} Created segment
     */
    async createSegment(data) {
        try {
            const segment = await prisma.segment.create({
                data: {
                    segmentName: data.segmentName,
                    college: data.college,
                    profileKeyword: data.profileKeyword,
                    majorGroup: data.majorGroup,
                    majorKeyword: data.majorKeyword,
                    majorCategory: data.majorCategory,
                    graduationClassStanding: data.graduationClassStanding,
                    degreeTypes: data.degreeTypes,
                    gpaMin: data.gpaMin,
                    gpaMax: data.gpaMax,
                    organizations: data.organizations,
                    jobRoleInterests: data.jobRoleInterests,
                    studentIndustryInterests: data.studentIndustryInterests,
                    jobSeekingInterests: data.jobSeekingInterests,
                    studentLocationPreferences: data.studentLocationPreferences,
                    currentLocation: data.currentLocation,
                    desiredSkills: data.desiredSkills,
                    coursework: data.coursework,
                    workExperience: data.workExperience ? {
                        create: data.workExperience.map(exp => ({
                            jobTitle: exp.jobTitle,
                            company: exp.company,
                            isCurrent: exp.isCurrent || false,
                        }))
                    } : undefined,
                    owner: data.owner,
                    studentCount: data.studentCount,
                    IsActive: data.IsActive !== undefined ? data.IsActive : true,
                },
            });

            return segment;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get paginated segments
     * 
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Segments and count
     */
    async getSegments({ page = 1, limit = 10, active = true }) {
        try {
            const skip = (page - 1) * limit;

            const [segments, totalCount] = await Promise.all([
                prisma.segment.findMany({
                    where: {
                        IsActive: active,
                    },
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        id: true,
                        segmentName: true,
                        createdAt: true,
                        studentCount: true,
                        college: true,
                        owner: true,
                    },
                }),
                prisma.segment.count({
                    where: {
                        IsActive: active,
                    },
                }),
            ]);

            return { segments, totalCount };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update segment active status
     * 
     * @param {string} id - Segment ID
     * @param {boolean} isActive - Active status
     * @returns {Promise<Object>} Updated segment
     */
    async updateSegmentStatus(id, isActive) {
        try {
            const segment = await prisma.segment.update({
                where: { id },
                data: { IsActive: isActive },
            });

            return segment;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new ApiError(404, 'Segment not found');
            }
            throw error;
        }
    },

    /**
     * Get segment by ID
     * 
     * @param {string} id - Segment ID
     * @returns {Promise<Object>} Segment
     */
    async getSegmentById(id) {
        try {
            const segment = await prisma.segment.findUnique({
                where: { id },
                include: {
                    workExperience: true,
                },
            });

            if (!segment) {
                throw new ApiError(404, 'Segment not found');
            }

            return segment;
        } catch (error) {
            throw error;
        }
    }
}; 