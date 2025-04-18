"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "../axios/axiosInstance";

export default function CreateSegmentPage() {
  const [formData, setFormData] = useState({
    segmentName: "",
    college: "",
    profileKeyword: "",
    majorGroup: "",
    majorKeyword: "",
    majorCategory: "STEAM",
    graduationClassStanding: "",
    degreeTypes: [] as string[],
    gpaMin: 0,
    gpaMax: 0,
    organizations: [] as string[],
    jobRoleInterests: [] as string[],
    studentIndustryInterests: [] as string[],
    jobSeekingInterests: [] as string[],
    studentLocationPreferences: "",
    currentLocation: "",
    desiredSkills: [] as string[],
    coursework: [] as string[],
    workExperience: [] as Array<{ jobTitle: string; company: string; isCurrent: boolean }>,
    owner: "admin-user-1234",
    studentCount: 0,
    IsActive: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpaMin' || name === 'gpaMax' || name === 'studentCount' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (name: string, value: string) => {
    const values = value.split(',').map(v => v.trim());
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const handleWorkExperienceChange = (index: number, field: 'jobTitle' | 'company', value: string) => {
    setFormData(prev => {
      const newWorkExperience = [...prev.workExperience];
      if (!newWorkExperience[index]) {
        newWorkExperience[index] = { jobTitle: '', company: '', isCurrent: false };
      }
      newWorkExperience[index][field] = value;
      return {
        ...prev,
        workExperience: newWorkExperience
      };
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        workExperience: formData.workExperience.map(exp => ({
          jobTitle: exp.jobTitle,
          company: exp.company,
          isCurrent: exp.isCurrent
        }))
      };
      const res = await axiosInstance.post('api/v1/segment/create', payload);
      setFormData({
        segmentName: "",
        college: "",
        profileKeyword: "",
        majorGroup: "",
        majorKeyword: "",
        majorCategory: "STEAM",
        graduationClassStanding: "",
        degreeTypes: [] as string[],
        gpaMin: 0,
        gpaMax: 0,
        organizations: [] as string[],
        jobRoleInterests: [] as string[],
        studentIndustryInterests: [] as string[],
        jobSeekingInterests: [] as string[],
        studentLocationPreferences: "",
        currentLocation: "",
        desiredSkills: [] as string[],
        coursework: [] as string[],
        workExperience: [] as Array<{ jobTitle: string; company: string; isCurrent: boolean }>,
        owner: "admin-user-1234",
        studentCount: 0,
        IsActive: true
      })
    } catch (error) {
      console.error('Error creating segment:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      segmentName: "",
      college: "",
      profileKeyword: "",
      majorGroup: "",
      majorKeyword: "",
      majorCategory: "STEAM",
      graduationClassStanding: "",
      degreeTypes: [],
      gpaMin: 0,
      gpaMax: 0,
      organizations: [],
      jobRoleInterests: [],
      studentIndustryInterests: [],
      jobSeekingInterests: [],
      studentLocationPreferences: "",
      currentLocation: "",
      desiredSkills: [],
      coursework: [],
      workExperience: [],
      owner: "admin-user-1234",
      studentCount: 0,
      IsActive: true
    });
  };

  return (
    <div className="relative bg-[#F9F9F9] w-full min-h-screen ">
      <div className="container mx-auto px-4 py-6 pt-[119px]">
        <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-sm px-6 py-3 w-full">
          <h1 className="text-xl font-semibold">Create Segment</h1>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
            Save Segment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-md border shadow-sm w-full">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="academics">
                  <AccordionTrigger className="px-4 py-3">
                    Academics & Extracurriculars
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-6 space-y-6">
                      {/* Segment Name */}
                      <div className="space-y-2">
                        <Label htmlFor="segment-name">Segment Name</Label>
                        <Input 
                          id="segment-name" 
                          name="segmentName"
                          value={formData.segmentName}
                          onChange={handleInputChange}
                          placeholder="Name" 
                        />
                      </div>

                      {/* College */}
                      <div className="space-y-2">
                        <Label htmlFor="college">College</Label>
                        <Select onValueChange={(value) => handleSelectChange('college', value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select College" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stanford">Stanford University</SelectItem>
                            <SelectItem value="mit">MIT</SelectItem>
                            <SelectItem value="harvard">Harvard University</SelectItem>
                            <SelectItem value="berkeley">UC Berkeley</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Profile keyword */}
                      <div className="space-y-2">
                        <Label htmlFor="profile-keyword">Profile keyword</Label>
                        <Select onValueChange={(value) => handleSelectChange('profileKeyword', value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Keywords" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="leadership">Leadership</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="innovation">Innovation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Major Group */}
                      <div className="space-y-2">
                        <Label htmlFor="major-group">Major Group</Label>
                        <Select onValueChange={(value) => handleSelectChange('majorGroup', value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="+ Add Major Group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cs">Computer Science</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="arts">Arts & Humanities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Major keyword */}
                      <div className="space-y-2">
                        <Label htmlFor="major-keyword">Major keyword</Label>
                        <Select onValueChange={(value) => handleSelectChange('majorKeyword', value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="+ Add Major keyword" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai">Artificial Intelligence</SelectItem>
                            <SelectItem value="data">Data Science</SelectItem>
                            <SelectItem value="web">Web Development</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Major keyword radio buttons */}
                      <div className="space-y-2">
                        <Label>Major Category</Label>
                        <RadioGroup
                          value={formData.majorCategory}
                          onValueChange={(value) => handleSelectChange('majorCategory', value)}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="STEAM" id="steam" />
                            <Label htmlFor="steam" className="font-normal">STEAM</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="TEMOnly" id="tem" />
                            <Label htmlFor="tem" className="font-normal">TEMOnly</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="LiberalArts" id="liberal-arts" />
                            <Label htmlFor="liberal-arts" className="font-normal">Liberal Arts</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Graduation and class standing */}
                      <div className="space-y-2">
                        <Label htmlFor="graduation">Graduation and class standing</Label>
                        <Select onValueChange={(value) => handleSelectChange('graduationClassStanding', value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Degree Type */}
                      <div className="space-y-2">
                        <Label>Degree Type</Label>
                        <RadioGroup
                          value={formData.degreeTypes[0] || ""}
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            degreeTypes: [value]
                          }))}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Associates" id="associates" />
                            <Label htmlFor="associates" className="font-normal">Associates</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Bachelors" id="bachelors" />
                            <Label htmlFor="bachelors" className="font-normal">Bachelors</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Masters" id="masters" />
                            <Label htmlFor="masters" className="font-normal">Masters</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Doctorate" id="doctorate" />
                            <Label htmlFor="doctorate" className="font-normal">Doctorate</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* GPA */}
                      <div className="space-y-2">
                        <Label>GPA</Label>
                        <div className="flex gap-4">
                          <Input 
                            placeholder="From" 
                            name="gpaMin"
                            value={formData.gpaMin.toString()}
                            onChange={handleInputChange}
                          />
                          <Input 
                            placeholder="To" 
                            name="gpaMax"
                            value={formData.gpaMax.toString()}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* Organizations / Extracurriculars */}
                      <div className="space-y-2">
                        <Label htmlFor="organizations">Organizations / Extracurriculars</Label>
                        <Input
                          id="organizations"
                          placeholder="+ Add Organizations / Extracurriculars (comma separated)"
                          onChange={(e) => handleArrayInputChange('organizations', e.target.value)}
                        />
                      </div>

                      {/* Job Role Interests */}
                      <div className="space-y-2">
                        <Label htmlFor="job-role">Job Role Interests</Label>
                        <Input
                          id="job-role"
                          placeholder="+ Add Job Role Interests (comma separated)"
                          onChange={(e) => handleArrayInputChange('jobRoleInterests', e.target.value)}
                        />
                      </div>

                      {/* Student Industry Interests */}
                      <div className="space-y-2">
                        <Label htmlFor="industry">Student Industry Interests</Label>
                        <Input
                          id="industry"
                          placeholder="+ Add Student Industry Interests (comma separated)"
                          onChange={(e) => handleArrayInputChange('studentIndustryInterests', e.target.value)}
                        />
                      </div>

                      {/* Student Job Seeking Interests */}
                      <div className="space-y-2">
                        <Label>Student Job Seeking Interests</Label>
                        <RadioGroup
                          value={formData.jobSeekingInterests[0] || ""}
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            jobSeekingInterests: [value]
                          }))}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="FullTime" id="full-time" />
                            <Label htmlFor="full-time" className="font-normal">Full-Time</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="PartTime" id="part-time" />
                            <Label htmlFor="part-time" className="font-normal">Part-Time</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="bg-white rounded-md border shadow-sm w-full">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="academics">
                  <AccordionTrigger className="px-4 py-3">
                    Location
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-6 space-y-6">
                      {/* Segment Name */}
                      <div className="space-y-2">
                        <Label htmlFor="segment-name">
                          Student Location Preferences
                        </Label>
                        <Input 
                          id="location-pref"
                          name="studentLocationPreferences"
                          value={formData.studentLocationPreferences}
                          onChange={handleInputChange}
                          placeholder="City" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="segment-name">Current Location</Label>
                        <Input 
                          id="current-location"
                          name="currentLocation"
                          value={formData.currentLocation}
                          onChange={handleInputChange}
                          placeholder="City" 
                        />
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="academics">
                        <AccordionTrigger className="px-4 py-3">
                            <h1 className=" text-[18px] font-bold ">Skills & Experience</h1>
                        </AccordionTrigger> 
                        <AccordionContent>
                          <div className="p-6 space-y-6">
                            {/* Segment Name */}
                            <div className="space-y-2">
                              <Label htmlFor=" text-[16px] segment-name">
                                <h1 className=" text-[16px] " >Desired Skills</h1>
                              </Label>
                              <Input
                                id="desired-skills"
                                placeholder="Enter Desired Skills (comma separated)"
                                onChange={(e) => handleArrayInputChange('desiredSkills', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="segment-name"><h1 className=" text-[16px] " >Course Work</h1></Label>
                              <Input
                                id="coursework"
                                placeholder="Enter Course Work (comma separated)"
                                onChange={(e) => handleArrayInputChange('coursework', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="job-title"><h1 className=" text-[16px] " >Work Experience</h1> </Label>
                              <div className="space-y-4">
                                {[0, 1].map((index) => (
                                  <div key={index} className="grid grid-cols-2 gap-4">
                                    <Input
                                      placeholder="Job title"
                                      onChange={(e) => handleWorkExperienceChange(index, 'jobTitle', e.target.value)}
                                    />
                                    <Input
                                      placeholder="Add Company"
                                      onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="terms" />
                              <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Accept terms and conditions
                              </label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className=" w-full flex justify-end ">
              <button 
                className=" bg-[#1111F4] px-3 font-bold font-sans py-3 text-white rounded-lg w-[172px] "
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1 w-full">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-blue-600">
                  1,034 Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm">Major Group</h3>
                  <p className="text-sm text-gray-600">
                    Computer Programming, Data Science, Computer Science,
                    computer engineering
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Class Of</h3>
                  <p className="text-sm text-gray-600">
                    2024, 2023, 2022, 2021
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Degree Type</h3>
                  <p className="text-sm text-gray-600">Bachelors</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">
                    Student Location Preferences
                  </h3>
                  <p className="text-sm text-gray-600">
                    San Francisco, California, United States
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Teaching Assistant</h3>
                  <p className="text-sm text-gray-600">Yes</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">
                    Has previous work experience
                  </h3>
                  <p className="text-sm text-gray-600">Yes</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Leadership Experience</h3>
                  <p className="text-sm text-gray-600">Yes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
