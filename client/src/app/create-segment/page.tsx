"use client";

import { useState, useEffect } from "react";
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
import { segmentApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Form validation types
interface ValidationError {
  field: string;
  message: string;
}

export default function CreateSegmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const initialFormState = {
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
  };

  const [formData, setFormData] = useState(initialFormState);

  // Reset success message after 3 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSuccess) {
      timeout = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpaMin' || name === 'gpaMax' || name === 'studentCount'
        ? parseFloat(value) || 0
        : value
    }));

    // Clear validation error for this field when user starts typing
    setValidationErrors(prev => prev.filter(error => error.field !== name));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(error => error.field !== name));
  };

  const handleArrayInputChange = (name: string, value: string) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v !== '');
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));

    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(error => error.field !== name));
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

    // Clear validation error for work experience
    setValidationErrors(prev => prev.filter(error => error.field !== 'workExperience'));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    if (!formData.segmentName.trim()) {
      errors.push({ field: 'segmentName', message: 'Segment name is required' });
    }

    if (formData.gpaMin > formData.gpaMax && formData.gpaMax > 0) {
      errors.push({ field: 'gpaMin', message: 'Minimum GPA should be less than maximum GPA' });
    }

    if (formData.gpaMax > 4.0) {
      errors.push({ field: 'gpaMax', message: 'Maximum GPA cannot exceed 4.0' });
    }

    // Validate work experience entries (if any are partially filled)
    const hasPartialWorkExp = formData.workExperience.some(exp =>
      (exp.jobTitle && !exp.company) || (!exp.jobTitle && exp.company)
    );

    if (hasPartialWorkExp) {
      errors.push({ field: 'workExperience', message: 'Please complete all work experience fields' });
    }

    // Check if terms are accepted
    if (!acceptTerms) {
      errors.push({ field: 'terms', message: 'You must accept the terms and conditions' });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Show toast for validation errors
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        workExperience: formData.workExperience
          .filter(exp => exp.jobTitle && exp.company) // Only include complete entries
          .map(exp => ({
            jobTitle: exp.jobTitle,
            company: exp.company,
            isCurrent: exp.isCurrent
          }))
      };

      const res = await segmentApi.createSegment(payload);

      // Show success message
      setIsSuccess(true);
      toast.success("Segment created successfully!");

      // Reset form
      setFormData(initialFormState);
      setAcceptTerms(false);

      // Optional: Redirect to segments list after a delay
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error) {
      console.error('Error creating segment:', error);
      toast.error("Failed to create segment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setValidationErrors([]);
    setAcceptTerms(false);
  };

  // Helper to get error for a specific field
  const getFieldError = (field: string): string => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="relative bg-[#F9F9F9] w-full min-h-screen">
      <div className="container mx-auto px-4 py-6 pt-[119px]">
        <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-sm px-6 py-3 w-full">
          <h1 className="text-xl font-semibold">Create Segment</h1>
          <Button
            className={`${isSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save Segment'
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-md border shadow-sm w-full">
              <Accordion type="single" collapsible className="w-full" defaultValue="academics">
                <AccordionItem value="academics">
                  <AccordionTrigger className="px-4 py-3">
                    Academics & Extracurriculars
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-6 space-y-6">
                      {/* Segment Name */}
                      <div className="space-y-2">
                        <Label htmlFor="segment-name" className="flex items-center">
                          Segment Name
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="segment-name"
                          name="segmentName"
                          value={formData.segmentName}
                          onChange={handleInputChange}
                          placeholder="Name"
                          className={getFieldError('segmentName') ? 'border-red-500' : ''}
                        />
                        {getFieldError('segmentName') && (
                          <p className="text-sm text-red-500 flex items-center mt-1">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {getFieldError('segmentName')}
                          </p>
                        )}
                      </div>

                      {/* College */}
                      <div className="space-y-2">
                        <Label htmlFor="college">College</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange('college', value)}
                          value={formData.college}
                        >
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
                        <Select
                          onValueChange={(value) => handleSelectChange('profileKeyword', value)}
                          value={formData.profileKeyword}
                        >
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
                        <Select
                          onValueChange={(value) => handleSelectChange('majorGroup', value)}
                          value={formData.majorGroup}
                        >
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
                        <Select
                          onValueChange={(value) => handleSelectChange('majorKeyword', value)}
                          value={formData.majorKeyword}
                        >
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
                        <Select
                          onValueChange={(value) => handleSelectChange('graduationClassStanding', value)}
                          value={formData.graduationClassStanding}
                        >
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
                          <div className="w-full">
                            <Input
                              placeholder="From"
                              name="gpaMin"
                              value={formData.gpaMin.toString()}
                              onChange={handleInputChange}
                              className={getFieldError('gpaMin') ? 'border-red-500' : ''}
                              type="number"
                              min="0"
                              max="4.0"
                              step="0.1"
                            />
                            {getFieldError('gpaMin') && (
                              <p className="text-sm text-red-500 mt-1">{getFieldError('gpaMin')}</p>
                            )}
                          </div>
                          <div className="w-full">
                            <Input
                              placeholder="To"
                              name="gpaMax"
                              value={formData.gpaMax.toString()}
                              onChange={handleInputChange}
                              className={getFieldError('gpaMax') ? 'border-red-500' : ''}
                              type="number"
                              min="0"
                              max="4.0"
                              step="0.1"
                            />
                            {getFieldError('gpaMax') && (
                              <p className="text-sm text-red-500 mt-1">{getFieldError('gpaMax')}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Organizations / Extracurriculars */}
                      <div className="space-y-2">
                        <Label htmlFor="organizations">Organizations / Extracurriculars</Label>
                        <Input
                          id="organizations"
                          placeholder="+ Add Organizations / Extracurriculars (comma separated)"
                          onChange={(e) => handleArrayInputChange('organizations', e.target.value)}
                          value={formData.organizations.join(', ')}
                        />
                      </div>

                      {/* Job Role Interests */}
                      <div className="space-y-2">
                        <Label htmlFor="job-role">Job Role Interests</Label>
                        <Input
                          id="job-role"
                          placeholder="+ Add Job Role Interests (comma separated)"
                          onChange={(e) => handleArrayInputChange('jobRoleInterests', e.target.value)}
                          value={formData.jobRoleInterests.join(', ')}
                        />
                      </div>

                      {/* Student Industry Interests */}
                      <div className="space-y-2">
                        <Label htmlFor="industry">Student Industry Interests</Label>
                        <Input
                          id="industry"
                          placeholder="+ Add Student Industry Interests (comma separated)"
                          onChange={(e) => handleArrayInputChange('studentIndustryInterests', e.target.value)}
                          value={formData.studentIndustryInterests.join(', ')}
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
              <Accordion type="single" collapsible className="w-full" defaultValue="location">
                <AccordionItem value="location">
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

                    <Accordion type="single" collapsible className="w-full" defaultValue="skills">
                      <AccordionItem value="skills">
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
                                value={formData.desiredSkills.join(', ')}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="segment-name"><h1 className=" text-[16px] " >Course Work</h1></Label>
                              <Input
                                id="coursework"
                                placeholder="Enter Course Work (comma separated)"
                                onChange={(e) => handleArrayInputChange('coursework', e.target.value)}
                                value={formData.coursework.join(', ')}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="job-title"><h1 className=" text-[16px] " >Work Experience</h1> </Label>
                              <div className="space-y-4">
                                {[0, 1].map((index) => (
                                  <div key={index} className="grid grid-cols-2 gap-4">
                                    <Input
                                      placeholder="Job title"
                                      value={formData.workExperience[index]?.jobTitle || ''}
                                      onChange={(e) => handleWorkExperienceChange(index, 'jobTitle', e.target.value)}
                                      className={getFieldError('workExperience') ? 'border-red-500' : ''}
                                    />
                                    <Input
                                      placeholder="Add Company"
                                      value={formData.workExperience[index]?.company || ''}
                                      onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                                      className={getFieldError('workExperience') ? 'border-red-500' : ''}
                                    />
                                  </div>
                                ))}
                                {getFieldError('workExperience') && (
                                  <p className="text-sm text-red-500 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {getFieldError('workExperience')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="terms"
                                checked={acceptTerms}
                                onCheckedChange={(checked) => {
                                  setAcceptTerms(checked === true);
                                  if (checked) {
                                    setValidationErrors(prev =>
                                      prev.filter(error => error.field !== 'terms')
                                    );
                                  }
                                }}
                                className={getFieldError('terms') ? 'border-red-500' : ''}
                              />
                              <label
                                htmlFor="terms"
                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${getFieldError('terms') ? 'text-red-500' : ''
                                  }`}
                              >
                                Accept terms and conditions
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                            </div>
                            {getFieldError('terms') && (
                              <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {getFieldError('terms')}
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className=" w-full flex justify-end gap-4">
              <Button
                variant="outline"
                className="px-3 font-bold font-sans py-3 w-[172px]"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 px-3 font-bold font-sans py-3 text-white w-[172px]"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Segment'
                )}
              </Button>
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
                    {formData.majorGroup ? formData.majorGroup : "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Class Of</h3>
                  <p className="text-sm text-gray-600">
                    {formData.graduationClassStanding ? formData.graduationClassStanding : "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Degree Type</h3>
                  <p className="text-sm text-gray-600">
                    {formData.degreeTypes.length > 0 ? formData.degreeTypes.join(', ') : "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">
                    Student Location Preferences
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formData.studentLocationPreferences || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Current Location</h3>
                  <p className="text-sm text-gray-600">
                    {formData.currentLocation || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">
                    Job Seeking Interest
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formData.jobSeekingInterests.length > 0 ? formData.jobSeekingInterests.join(', ') : "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm">Desired Skills</h3>
                  <p className="text-sm text-gray-600">
                    {formData.desiredSkills.length > 0
                      ? formData.desiredSkills.slice(0, 3).join(', ') + (formData.desiredSkills.length > 3 ? '...' : '')
                      : "Not specified"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
