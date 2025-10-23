import { Suspense, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Calendar as CalendarIcon, ChevronRight, Clock, Link, Search, Users } from "lucide-react";
import { useApiQuery, useApiMutation } from "@/integrations/api";
import type { CourseDto, CourseCreateDto, CourseUpdateDto } from "@repo/api/courses/dto";
import type { SetStateAction } from "react";
import Header from "@/_components/header";
import { Card, CardContent } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Spinner } from "@/_components/ui/spinner"
import { useAuth0 } from "@auth0/auth0-react";

export const Route = createFileRoute('/courses/')({
  component: CoursesPage,
})

type Course = CourseDto;


const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

function CoursesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  const [form, setForm] = useState<Partial<CourseCreateDto & { id?: string }>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Move all hooks to the top before any conditional returns
  const isEditing = useMemo(() => !!editingId, [editingId]);

  const coursesQuery = useApiQuery<Course[]>(['courses'], '/courses');
  
  const createCourseMutation = useApiMutation<CourseCreateDto, Course>({
    path: '/courses',
    method: 'POST',
    invalidateKeys: [['courses']]
  });

  const updateCourseMutation = useApiMutation<CourseUpdateDto, Course>({
    endpoint: () => ({ path: '/courses', method: 'PATCH' }),
    invalidateKeys: [['courses']]
  });

  const deleteCourseMutation = useApiMutation<{ id: string }, void>({
    endpoint: (variables) => ({ path: `/courses/${variables.id}`, method: 'DELETE' }),
    invalidateKeys: [['courses']]
  });

  // Calculate filtered courses and semesters after hooks
  const filteredCourses = coursesQuery.data?.filter(course => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = filterSemester === 'all'; // no semester field in schema
    return matchesSearch && matchesSemester;
  }) || [];

  const semesters = ['all'];

  if (coursesQuery.error) {
    return <div className="text-red-600">{coursesQuery.error.message}</div>;
  }
  if (coursesQuery.showLoading) {
    return <div className="text-gray-500">Loading courses…</div>;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const payload: CourseCreateDto = {
      code: form.code ?? '',
      title: form.title ?? '',
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
    };
    await createCourseMutation.mutateAsync(payload);
    setForm({});
  }

  async function handleStartEdit(course: Course) {
    setEditingId(course.id);
    setForm({
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description ?? undefined,
      startDate: course.startDate ?? undefined,
      endDate: course.endDate ?? undefined,
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    const payload: CourseUpdateDto = {
      id: editingId,
      code: form.code,
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
    };
    await updateCourseMutation.mutateAsync(payload);
    setForm({});
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    await deleteCourseMutation.mutateAsync({ id });
  }

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
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterSemester}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setFilterSemester(e.target.value)}
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

            {/* Create / Edit Form */}
            <div className="mb-8 border rounded-md p-4">
              <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Course' : 'Create Course'}</h2>
              <form onSubmit={isEditing ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Code" value={form.code ?? ''} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
                <Input placeholder="Title" value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                <Input placeholder="Description" value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                <Input placeholder="Start Date (ISO)" value={form.startDate ?? ''} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
                <Input placeholder="End Date (ISO)" value={form.endDate ?? ''} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
                <div className="col-span-1 md:col-span-2 flex gap-2">
                  <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({}); }}>Cancel</Button>
                  )}
                </div>
              </form>
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
                        <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => handleStartEdit(course)}>
                          View Course
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(course.id)}>Delete</Button>
                        </div>
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
      </div>
    </div>
  )
}

function CoursesPage() {
  const { isAuthenticated, isLoading } = useAuth0();

  
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center h-screen">
      <Spinner className="size-24" />
      Loading...
    </div>;
  }

  if (!isAuthenticated) {
    return <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/login" className="text-blue-500 hover:underline">Please login to view the dashboard</Link>
    </div>;
  } else {
    return (
      <div>
        <Suspense fallback={<div className="flex items-center gap-6"><Spinner className="size-24" /></div>}>
          <CoursesList />
        </Suspense>
      </div>
    );
  }
}
