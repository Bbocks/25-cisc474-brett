'use client'

import { useEffect, useState, Suspense } from "react";
import Header from "@/_components/header";
import { Card, CardContent } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Calendar } from "@/_components/ui/calendar";
import {
  BookOpen, 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  Search,
  ChevronRight
} from "lucide-react";
import { apiFetch } from "../lib/api";

type Course = {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};


const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

function CoursesList() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch<Course[]>('/courses');
        if (!cancelled) setCourses(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load courses');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
  if (!courses) {
    return <div className="text-gray-500">Loading courses…</div>;
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = filterSemester === 'all'; // no semester field in schema
    return matchesSearch && matchesSemester;
  });

  const semesters = ['all'];

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Main courses content */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-6">My Courses</h1>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses, instructors, or course codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>
                      {semester === 'all' ? 'All Semesters' : semester}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Courses List */}
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Course Color Indicator */}
                        <div className="w-4 h-4 rounded-full flex-shrink-0 bg-blue-500" />
                        
                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{course.code}</h3>
                            <Badge className={getGradeColor('A-')}>
                              A-
                            </Badge>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-1">{course.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">Instructor TBD</p>
                          <p className="text-sm text-gray-700 line-clamp-1">{course.description}</p>
                        </div>

                        {/* Course Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Semester TBD</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>3 credits</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>--/-- assignments</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="w-32">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>--%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ width: `0%`, backgroundColor: '#3B82F6' }}
                            />
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          View Course
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        </div>
        <Suspense fallback={<div className="text-sm text-gray-500">Loading courses...</div>}>
          <CoursesList />
        </Suspense>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <CoursesList />
    </Suspense>
  );
}
