import { PrismaClient, DegreeType, JobSeekingInterest, MajorCategory } from '@prisma/client';

const prisma = new PrismaClient();

export const createSegment = async (req, res) => {
    try {
        const {
            segmentName,
            college,
            profileKeyword,
            majorGroup,
            majorKeyword,
            majorCategory,
            graduationClassStanding,
            degreeTypes,
            gpaMin,
            gpaMax,
            organizations,
            jobRoleInterests,
            studentIndustryInterests,
            jobSeekingInterests,
            studentLocationPreferences,
            currentLocation,
            desiredSkills,
            coursework,
            workExperience,
            owner,
            studentCount,
            IsActive = true,
        } = req.body;

        const createdSegment = await prisma.segment.create({
            data: {
                segmentName,
                college,
                profileKeyword,
                majorGroup,
                majorKeyword,
                majorCategory,
                graduationClassStanding,
                degreeTypes,
                gpaMin,
                gpaMax,
                organizations,
                jobRoleInterests,
                studentIndustryInterests,
                jobSeekingInterests,
                studentLocationPreferences,
                currentLocation,
                desiredSkills,
                coursework,
                workExperience: {
                    create: workExperience.map((exp) => ({
                        jobTitle: exp.jobTitle,
                        company: exp.company,
                        isCurrent: exp.isCurrent || false,
                    })),
                },
                owner,
                studentCount,
                IsActive,
            },
        });

        res.status(201).json({ success: true, data: createdSegment, message: "Segment created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getSegments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const active = req.query.active === 'false' ? false : true;
        const skip = (page - 1) * limit;

        const [segments, totalCount] = await Promise.all([
            prisma.segment.findMany({
                where: {
                    IsActive: active, // only active segments
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
                    IsActive: true,
                },
            }),
        ]);

        res.status(200).json({
            success: true,
            data: segments,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch segments' });
    }
};

export const updateSegmentStatus = async (req, res) => {
    try {
        const { id } = req.query;
        const IsActive = req.body.IsActive;
        if (typeof IsActive !== 'boolean') {
            return res.status(400).json({ success: false, message: 'IsActive must be a boolean' });
        }

        const updatedSegment = await prisma.segment.update({
            where: { id },
            data: { IsActive },
        });

        res.status(200).json({ success: true, data: updatedSegment, message: 'Segment status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update segment status' });
    }
};
