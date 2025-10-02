'use client';

import { useEffect, useState, Suspense } from "react";
import Header from "@/_components/header";
import Calendar from "./calendar";
import { Checkbox } from "@/_components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { apiFetch } from "../lib/api";
import type { CalendarFeature } from "./calendar";

type Course = { id: string; code: string; title: string };

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
                const data = await apiFetch<Course[]>('/courses');
                if (cancelled) return;
                setCourses(data);
                const visibility = data.reduce<Record<string, boolean>>((acc, c) => {
                    acc[c.id] = true;
                    return acc;
                }, {});
                setVisibleClasses(visibility);
                // TODO: When assignments have dates, fetch and map accordingly
                setFeatures([]);
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
                                {(courses || []).map((c) => (
                                    <div key={cls.id} className="flex items-center space-x-2">
                                        <Checkbox id={c.id} checked={!!visibleClasses[c.id]} onCheckedChange={() => handleClassToggle(c.id)} />
                                        <label htmlFor={c.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2 cursor-pointer">
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                            <span>{c.code} - {c.title}</span>
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