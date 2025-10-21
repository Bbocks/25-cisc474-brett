import { useMemo, useState, Suspense } from "react";
import Header from "@/_components/header";
import Calendar from "@/_components/calendar-helper";
import { Checkbox } from "@/_components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Spinner } from "@/_components/ui/spinner"
import { useApiQuery } from "@/integrations/api";
import type { CourseDto } from "@repo/api/courses/dto";
import type { AssignmentDto } from "@repo/api/assignments/dto";
import type { CalendarFeature } from "@/_components/calendar-helper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/calendar')({
    component: CalendarPage,
  })

type Course = CourseDto;
type Assignment = AssignmentDto;

function CalendarPageInner() {
    const [visibleClasses, setVisibleClasses] = useState<Record<string, boolean>>({});
    
    const coursesQuery = useApiQuery<Course[]>(['courses'], '/courses');
    const assignmentsQuery = useApiQuery<Assignment[]>(['assignments'], '/assignments');

    // Initialize visibility when courses load
    const courses = coursesQuery.data || [];
    if (courses.length > 0 && Object.keys(visibleClasses).length === 0) {
        const visibility = courses.reduce<Record<string, boolean>>((acc, c) => {
            acc[c.id] = true;
            return acc;
        }, {});
        setVisibleClasses(visibility);
    }

    // Map assignments to calendar features
    const features = useMemo(() => {
        if (!assignmentsQuery.data) return [];
        
        const defaultColor = "#3B82F6";
        const courseIdToColor = new Map<string, string>();
        for (const c of courses) courseIdToColor.set(c.id, defaultColor);

        return (assignmentsQuery.data || [])
          .filter(a => !!a.dueAt)
          .map(a => {
            const due = new Date(a.dueAt as string);
            const color = courseIdToColor.get(a.courseId) || defaultColor;
            return {
              id: a.id,
              name: a.title,
              startAt: due,
              endAt: due,
              status: { id: "due", name: "Due", color },
              classId: a.courseId,
              classColor: color,
            } as CalendarFeature;
          });
    }, [assignmentsQuery.data, courses]);

    const handleClassToggle = (classId: string) => {
        setVisibleClasses(prev => ({
            ...prev,
            [classId]: !prev[classId]
        }));
    };

    return (
        <div>
            <Header />
            <div className="mx-auto px-4 py-8 max-w-screen-2xl">
                <div className="flex gap-6">
                    {/* Calendar - 75% width */}
                    <div className="flex-1" style={{ width: '75%' }}>
                        {coursesQuery.showLoading || assignmentsQuery.showLoading ? (
                            <div className="p-6 text-gray-500">Loading calendar…</div>
                        ) : coursesQuery.error || assignmentsQuery.error ? (
                            <div className="p-6 text-red-600">{coursesQuery.error?.message || assignmentsQuery.error?.message || 'Failed to load'}</div>
                        ) : (
                            <Calendar
                                visibleClasses={visibleClasses}
                                classes={courses.map(c => ({ id: c.id, name: `${c.code} - ${c.title}`, color: '#3B82F6', visible: true }))}
                                features={features}
                            />
                        )}
                    </div>
                    
                    {/* Class Visibility Panel - 25% width */}
                    <div className="w-1/4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Class Visibility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {courses.map((course) => (
                                    <div key={course.id} className="flex items-center space-x-2">
                                        <Checkbox id={course.id} checked={!!visibleClasses[course.id]} onCheckedChange={() => handleClassToggle(course.id)} />
                                        <label htmlFor={course.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2 cursor-pointer">
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                            <span>{course.code} - {course.title}</span>
                                        </label>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

 function CalendarPage() {
    return (
        <Suspense fallback={<div className="flex items-center gap-6"><Spinner className="size-24" /></div>}>
            <CalendarPageInner />
        </Suspense>
    );
}