-- CreateEnum
CREATE TYPE "MajorCategory" AS ENUM ('STEAM', 'TEMOnly', 'LiberalArts');

-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('Associates', 'Bachelors', 'Masters', 'Doctorate', 'PostdoctoralStudies', 'TechnicalDiploma');

-- CreateEnum
CREATE TYPE "JobSeekingInterest" AS ENUM ('FullTime', 'PartTime');

-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL,
    "segmentName" TEXT NOT NULL,
    "college" TEXT,
    "profileKeyword" TEXT,
    "majorGroup" TEXT,
    "majorKeyword" TEXT,
    "majorCategory" "MajorCategory",
    "graduationClassStanding" TEXT,
    "degreeTypes" "DegreeType"[],
    "gpaMin" DOUBLE PRECISION,
    "gpaMax" DOUBLE PRECISION,
    "organizations" TEXT[],
    "jobRoleInterests" TEXT[],
    "studentIndustryInterests" TEXT[],
    "jobSeekingInterests" "JobSeekingInterest"[],
    "studentLocationPreferences" TEXT,
    "currentLocation" TEXT,
    "desiredSkills" TEXT[],
    "coursework" TEXT[],
    "studentCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "owner" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "segmentId" TEXT NOT NULL,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
