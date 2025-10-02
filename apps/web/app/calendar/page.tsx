'use client';

import { useEffect, useState, Suspense } from "react";
import Header from "@/_components/header";
import Calendar from "./calendar";
import { Checkbox } from "@/_components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { apiFetch } from "../lib/api";
import type { CalendarFeature } from "./calendar";

type Course = { id: string; code: string; title: string };
type Assignment = {
  id: string;
  courseId: string;
  title: string;
  dueAt?: string | null;
};

function CalendarPageInner() {
    const [courses, setCourses] = useState<Course[] | null>(null);
    const [visibleClasses, setVisibleClasses] = useState<Record<string, boolean>>({});
    const [features, setFeatures] = useState<CalendarFeature[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const coursesRes = await apiFetch<Course[]>('/courses');
                if (cancelled) return;
                setCourses(coursesRes);
                const visibility = coursesRes.reduce<Record<string, boolean>>((acc, c) => {
                    acc[c.id] = true;
                    return acc;
                }, {});
                setVisibleClasses(visibility);
                // Fetch assignments and map to calendar features
                const assignmentsRes = await apiFetch<Assignment[]>('/assignments');
                if (cancelled) return;
                // Build course color map (default to blue)
                const defaultColor = "#3B82F6";
                const courseIdToColor = new Map<string, string>();
                for (const c of coursesRes) courseIdToColor.set(c.id, defaultColor);

                const mapped: CalendarFeature[] = (assignmentsRes || [])
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
                setFeatures(mapped);
            } catch (e: any) {
                if (!cancelled) setError(e?.message || 'Failed to load');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

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
                        {loading ? (
                            <div className="p-6 text-gray-500">Loading calendar…</div>
                        ) : error ? (
                            <div className="p-6 text-red-600">{error}</div>
                        ) : (
                            <Calendar
                                visibleClasses={visibleClasses}
                                classes={(courses || []).map(c => ({ id: c.id, name: `${c.code} - ${c.title}`, color: '#3B82F6', visible: true }))}
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
                                {(courses || []).map((course) => (
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

export default function CalendarPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading…</div>}>
            <CalendarPageInner />
        </Suspense>
    );
}