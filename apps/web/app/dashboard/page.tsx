'use client';

import { useEffect, useMemo, useState, Suspense } from "react";
import Header from "@/_components/header";
import { Calendar } from "@/_components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle,
  Circle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";

type Course = {
  id: string;
  code: string;
  title: string;
  description?: string | null;
};

type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  dueAt?: string | null; // from prisma: Assignment has dueAt
  totalPoints?: number | null; // from prisma: totalPoints
};

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'submitted': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'late': return <AlertCircle className="h-4 w-4 text-red-600" />;
    default: return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

const getDaysUntilDue = (dueDate: Date) => {
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getUrgencyColor = (daysUntil: number) => {
  if (daysUntil < 0) return 'text-red-600';
  if (daysUntil <= 1) return 'text-red-500';
  if (daysUntil <= 3) return 'text-yellow-600';
  return 'text-gray-600';
};

function DashboardInner() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const router = useRouter();

  const [courses, setCourses] = useState<Course[] | null>(null);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [coursesRes, assignmentsRes] = await Promise.all([
          apiFetch<Course[]>('/courses'),
          apiFetch<Assignment[]>('/assignments'),
        ]);
        if (cancelled) return;
        setCourses(coursesRes);
        setAssignments(assignmentsRes);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load dashboard');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const assignmentsWithDates = useMemo(() => {
    return (assignments || [])
      .map(a => ({ ...a, dueDate: a.dueAt ? new Date(a.dueAt) : null }))
      .filter(a => a.dueDate !== null) as Array<Assignment & { dueDate: Date }>;
  }, [assignments]);

  const sortedAssignments = useMemo(() => {
    return [...assignmentsWithDates].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [assignmentsWithDates]);

  // Group dates by urgency for calendar dot styling
  const { overdueDates, todayDates, soonDates, laterDates } = useMemo(() => {
    const uniqueDates = new Map<string, Date>();
    for (const a of assignmentsWithDates) {
      const d = new Date(a.dueDate.getFullYear(), a.dueDate.getMonth(), a.dueDate.getDate());
      uniqueDates.set(d.toDateString(), d);
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneDayMs = 1000 * 60 * 60 * 24;

    const overdue: Date[] = [];
    const todayArr: Date[] = [];
    const soon: Date[] = [];
    const later: Date[] = [];

    for (const d of uniqueDates.values()) {
      const diffDays = Math.floor((d.getTime() - today.getTime()) / oneDayMs);
      if (diffDays < 0) overdue.push(d);
      else if (diffDays === 0) todayArr.push(d);
      else if (diffDays <= 3) soon.push(d);
      else later.push(d);
    }

    return { overdueDates: overdue, todayDates: todayArr, soonDates: soon, laterDates: later };
  }, [assignmentsWithDates]);

  const modifiers = { overdue: overdueDates, today: todayDates, soon: soonDates, later: laterDates };
  const modifiersClassNames = {
    overdue: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-500",
    today: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-amber-500",
    soon: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-yellow-500",
    later: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-blue-500",
  };

  const selectedDateAssignments = useMemo(() => {
    if (!selectedDate) return [] as Array<Assignment & { dueDate: Date }>;
    return assignmentsWithDates.filter(a => a.dueDate.toDateString() === selectedDate.toDateString());
  }, [assignmentsWithDates, selectedDate]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!courses || !assignments) {
    return <div className="p-6 text-gray-500">Loading…</div>;
  }

  const totalCourses = courses.length;
  const avgProgress = 0; // Placeholder: no progress field yet

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Main dashboard content */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Courses</p>
                      <p className="text-2xl font-bold">{totalCourses}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Progress</p>
                      <p className="text-2xl font-bold">{avgProgress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Grade</p>
                      <p className="text-2xl font-bold">--</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Due Soon</p>
                      <p className="text-2xl font-bold">
                        {sortedAssignments.filter(a => getDaysUntilDue(a.dueDate) <= 3).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Cards */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full bg-blue-500"
                          />
                          <div>
                            <CardTitle className="text-lg">{course.code}</CardTitle>
                            <p className="text-sm text-gray-600">{course.title}</p>
                          </div>
                        </div>
                        <Badge className={getGradeColor('A-')}>
                          A-
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">Instructor TBD</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      <div>
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

                      {/* Course Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span>Semester TBD</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>3 credits</span>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <p className="text-sm font-medium mb-2">Recent Activity</p>
                        <div className="space-y-1 text-sm text-gray-500">
                          No recent activity
                        </div>
                      </div>

                      {/* Next Due Date */}
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Next due: --</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          View Course
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => router.push('/courses/grades')}>
                          Grades
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right side - Calendar and Assignments */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <h2 className="text-2xl font-semibold mb-4">Calendar & Assignments</h2>
            
            {/* Calendar */}
            <Card className="p-6 mb-6">
              <Calendar 
                className="bg-inherit"
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
            </Card>

            {/* Selected Date Assignments */}
            {selectedDate && selectedDateAssignments.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Assignments for {selectedDate.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedDateAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div 
                          className="w-3 h-3 rounded-full bg-blue-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{assignment.title}</p>
                          <p className="text-xs text-gray-600">{courses.find(c => c.id === assignment.courseId)?.code}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {(assignment.totalPoints ?? 0)} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedAssignments.slice(0, 5).map((assignment) => {
                    const daysUntil = getDaysUntilDue(assignment.dueDate);
                    const course = courses.find(c => c.id === assignment.courseId);
                    return (
                      <div key={assignment.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{assignment.title}</p>
                          <p className="text-xs text-gray-600">{course?.code}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${getUrgencyColor(daysUntil)}`}>
                            {daysUntil < 0 ? 'Overdue' : 
                             daysUntil === 0 ? 'Due Today' :
                             daysUntil === 1 ? 'Due Tomorrow' :
                             `${daysUntil} days`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {assignment.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {sortedAssignments.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View All Assignments
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <DashboardInner />
    </Suspense>
  );
}