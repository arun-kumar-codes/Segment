"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import axiosInstance from "./axios/axiosInstance";
import Link from "next/link";

interface Segment {
  id: string;
  segmentName: string;
  createdAt: string;
  studentCount: number;
  college: string;
  owner: string;
}

export default function SegmentManagement() {
  const [activeTab, setActiveTab] = useState<"active" | "achieve">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getAll = async () => {
      try {
        const res = await axiosInstance.get(`api/v1/segment/get?active=${activeTab === "active"}`);
        setSegments(res.data.data);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      } catch (error) {
        console.error("Error fetching segments:", error);
      }
    };

    getAll();
  }, [activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          className={`w-8 h-8 p-0 ${
            i === currentPage ? "bg-blue-600 hover:bg-blue-700" : ""
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
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="ghost"
          className="w-8 h-8 p-0"
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
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
                  className={`px-4 sm:px-6 py-3 font-medium text-sm relative ${
                    activeTab === "active"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("active")}
                >
                  Active
                  {activeTab === "active" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  className={`px-4 sm:px-6 py-3 font-medium text-sm relative ${
                    activeTab === "achieve"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("achieve")}
                >
                  Achieve
                  {activeTab === "achieve" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>
              <div className="py-2 px-4 sm:px-6">
                <Link href={'/create-segment'} className=" cursor-pointer" >
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
                placeholder="Search"
                className="pl-10 bg-gray-50 border-gray-200 w-full"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Table */}
        </div>
        <div>
          <div className="overflow-x-auto mt-5 bg-white h-auto min-h-[653px] w-full rounded-lg shadow-sm px-4 sm:px-6">
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
                {segments.map((segment, index) => (
                  <TableRow key={segment.id}>
                    <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
                    <TableCell>{segment.segmentName}</TableCell>
                    <TableCell>{new Date(segment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{segment.studentCount}</TableCell>
                    <TableCell>{segment.college}</TableCell>
                    <TableCell>{segment.owner}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex justify-end overflow-x-auto">{renderPagination()}</div>
        </div>
      </div>
    </div>
  );
}
