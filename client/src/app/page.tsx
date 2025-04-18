"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { segmentApi } from "@/lib/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "@/lib/utils";

// Define types
interface Segment {
  id: string;
  segmentName: string;
  createdAt: string;
  studentCount: number;
  college: string;
  owner: string;
}

interface SegmentResponse {
  success: boolean;
  data: Segment[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

interface FilterOptions {
  college: string | null;
  dateRange: string | null;
  studentCountMin: number | null;
  studentCountMax: number | null;
  includeEmpty: boolean;
}

export default function SegmentManagement() {
  // State
  const [activeTab, setActiveTab] = useState<"active" | "achieve">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [filteredSegments, setFilteredSegments] = useState<Segment[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    college: null,
    dateRange: null,
    studentCountMin: null,
    studentCountMax: null,
    includeEmpty: true,
  });

  // Active filters count
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // College options for select
  const collegeOptions = [
    { value: "stanford", label: "Stanford University" },
    { value: "mit", label: "MIT" },
    { value: "harvard", label: "Harvard University" },
    { value: "berkeley", label: "UC Berkeley" },
  ];

  // Date range options
  const dateRangeOptions = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "year", label: "This year" },
  ];

  // Fetch segments
  const fetchSegments = async (page = currentPage) => {
    try {
      setIsLoading(true);
      const res = await segmentApi.getSegments(page, 10, activeTab === "active");
      const responseData = res.data as SegmentResponse;

      setSegments(responseData.data);
      setFilteredSegments(responseData.data);
      setTotalPages(responseData.totalPages);
      setCurrentPage(responseData.currentPage);
    } catch (error) {
      console.error("Error fetching segments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch segments when tab changes
  useEffect(() => {
    fetchSegments(1); // Reset to page 1 when tab changes
  }, [activeTab]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchSegments(page);
    }
  };

  // Apply search and filters to the segments
  const applyFiltersAndSearch = useCallback(() => {
    // Start with all segments
    let results = [...segments];

    // Apply search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (segment) =>
          segment.segmentName.toLowerCase().includes(term) ||
          segment.college.toLowerCase().includes(term) ||
          segment.owner.toLowerCase().includes(term)
      );
    }

    // Apply college filter
    if (filterOptions.college) {
      results = results.filter(segment =>
        segment.college.toLowerCase() === filterOptions.college!.toLowerCase()
      );
    }

    // Apply date range filter
    if (filterOptions.dateRange) {
      const now = new Date();
      let cutoffDate = new Date();

      switch (filterOptions.dateRange) {
        case "7days":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case "year":
          cutoffDate = new Date(now.getFullYear(), 0, 1); // Start of this year
          break;
      }

      results = results.filter(segment =>
        new Date(segment.createdAt) >= cutoffDate
      );
    }

    // Apply student count filters
    if (filterOptions.studentCountMin !== null) {
      results = results.filter(segment =>
        segment.studentCount >= filterOptions.studentCountMin!
      );
    }

    if (filterOptions.studentCountMax !== null) {
      results = results.filter(segment =>
        segment.studentCount <= filterOptions.studentCountMax!
      );
    }

    // Filter out segments with zero students if includeEmpty is false
    if (!filterOptions.includeEmpty) {
      results = results.filter(segment => segment.studentCount > 0);
    }

    setFilteredSegments(results);
  }, [segments, searchTerm, filterOptions]);

  // Update filters when changed
  useEffect(() => {
    applyFiltersAndSearch();

    // Count active filters
    let count = 0;
    if (filterOptions.college) count++;
    if (filterOptions.dateRange) count++;
    if (filterOptions.studentCountMin !== null) count++;
    if (filterOptions.studentCountMax !== null) count++;
    if (!filterOptions.includeEmpty) count++;

    setActiveFiltersCount(count);
  }, [applyFiltersAndSearch, filterOptions]);

  // Handle search with debounce
  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterOptions({
      college: null,
      dateRange: null,
      studentCountMin: null,
      studentCountMax: null,
      includeEmpty: true,
    });
    setSearchTerm("");
  };

  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "ghost"}
          className={`w-8 h-8 p-0 ${i === currentPage ? "bg-blue-600 hover:bg-blue-700" : ""
            }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          className="w-8 h-8 p-0"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="ghost"
          className="w-8 h-8 p-0"
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="ml-4 text-sm text-gray-500">Of {totalPages}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-[119px] w-full">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex flex-col sm:flex-row justify-between w-full">
              <div className="flex">
                <button
                  className={`px-4 sm:px-6 py-3 font-medium text-sm relative ${activeTab === "active"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                  onClick={() => setActiveTab("active")}
                  disabled={isLoading}
                >
                  Active
                  {activeTab === "active" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  className={`px-4 sm:px-6 py-3 font-medium text-sm relative ${activeTab === "achieve"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                  onClick={() => setActiveTab("achieve")}
                  disabled={isLoading}
                >
                  Archive
                  {activeTab === "achieve" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>
              <div className="py-2 px-4 sm:px-6">
                <Link href="/create-segment" className="cursor-pointer">
                  <Button className="bg-[#1111F4] rounded-md hover:bg-blue-700 cursor-pointer w-full sm:w-auto">
                    Create Segment
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, college, or owner"
                className="pl-10 bg-gray-50 border-gray-200 w-full"
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSearchTerm("");
                    // Also clear the input field
                    const inputElement = document.querySelector('input[placeholder="Search by name, college, or owner"]') as HTMLInputElement;
                    if (inputElement) {
                      inputElement.value = "";
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4" />
                    Filter
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-1 bg-blue-600 hover:bg-blue-700">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-gray-500"
                        onClick={resetFilters}
                      >
                        Reset
                      </Button>
                    </div>

                    {/* College Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="college-filter">College</Label>
                      <Select
                        value={filterOptions.college || "all"}
                        onValueChange={(value) =>
                          setFilterOptions({
                            ...filterOptions,
                            college: value === "all" ? null : value
                          })
                        }
                      >
                        <SelectTrigger id="college-filter">
                          <SelectValue placeholder="All Colleges" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Colleges</SelectItem>
                          {collegeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Range Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="date-filter">Created Date</Label>
                      <Select
                        value={filterOptions.dateRange || "all"}
                        onValueChange={(value) =>
                          setFilterOptions({
                            ...filterOptions,
                            dateRange: value === "all" ? null : value
                          })
                        }
                      >
                        <SelectTrigger id="date-filter">
                          <SelectValue placeholder="Any time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any time</SelectItem>
                          {dateRangeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Student Count Range */}
                    <div className="space-y-2">
                      <Label>Student Count</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          placeholder="Min"
                          className="w-full"
                          min={0}
                          value={filterOptions.studentCountMin || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            setFilterOptions({
                              ...filterOptions,
                              studentCountMin: value
                            });
                          }}
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          className="w-full"
                          min={0}
                          value={filterOptions.studentCountMax || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            setFilterOptions({
                              ...filterOptions,
                              studentCountMax: value
                            });
                          }}
                        />
                      </div>
                    </div>

                    {/* Include Empty Segments */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-empty"
                        checked={filterOptions.includeEmpty}
                        onCheckedChange={(checked) => {
                          setFilterOptions({
                            ...filterOptions,
                            includeEmpty: checked as boolean
                          });
                        }}
                      />
                      <label
                        htmlFor="include-empty"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include segments with no students
                      </label>
                    </div>

                    {/* Apply Filter Button */}
                    <Button
                      className="w-full mt-2"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || activeFiltersCount > 0) && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>

            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <span>Search: "{searchTerm}"</span>
                <button onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filterOptions.college && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <span>College: {collegeOptions.find(o => o.value === filterOptions.college)?.label}</span>
                <button onClick={() => setFilterOptions({ ...filterOptions, college: null })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filterOptions.dateRange && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <span>Date: {dateRangeOptions.find(o => o.value === filterOptions.dateRange)?.label}</span>
                <button onClick={() => setFilterOptions({ ...filterOptions, dateRange: null })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filterOptions.studentCountMin !== null || filterOptions.studentCountMax !== null) && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <span>
                  Students:
                  {filterOptions.studentCountMin !== null ? ` Min: ${filterOptions.studentCountMin}` : ""}
                  {filterOptions.studentCountMin !== null && filterOptions.studentCountMax !== null ? " -" : ""}
                  {filterOptions.studentCountMax !== null ? ` Max: ${filterOptions.studentCountMax}` : ""}
                </span>
                <button onClick={() => setFilterOptions({
                  ...filterOptions,
                  studentCountMin: null,
                  studentCountMax: null
                })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {!filterOptions.includeEmpty && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <span>Hide empty segments</span>
                <button onClick={() => setFilterOptions({ ...filterOptions, includeEmpty: true })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-gray-500"
              onClick={resetFilters}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Segments Table */}
        <div>
          <div className="overflow-x-auto mt-5 bg-white h-auto min-h-[653px] w-full rounded-lg shadow-sm px-4 sm:px-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Filter Results Count */}
                {(searchTerm || activeFiltersCount > 0) && (
                  <div className="pt-4 pb-2 text-sm text-gray-500">
                    Showing {filteredSegments.length} of {segments.length} segments
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">ID</TableHead>
                      <TableHead>Segment Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Student Count</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="w-16">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSegments.length > 0 ? (
                      filteredSegments.map((segment, index) => (
                        <TableRow key={segment.id}>
                          <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
                          <TableCell>{segment.segmentName}</TableCell>
                          <TableCell>{new Date(segment.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{segment.studentCount || 0}</TableCell>
                          <TableCell>{segment.college || 'N/A'}</TableCell>
                          <TableCell>{segment.owner}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          {searchTerm || activeFiltersCount > 0
                            ? "No segments match your filters"
                            : "No segments found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </div>

          {/* Pagination */}
          <div className="p-4 flex justify-end overflow-x-auto">
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
}
