'use client'

import { Suspense } from 'react'
import Header from '@/_components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { BookOpen } from 'lucide-react'
import { CoursesList } from '../_components/CoursesList'
import { AssignmentsList } from '../_components/AssignmentsList'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="text-sm text-gray-500">Loading courses...</div>}>
                    <CoursesList />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:w-80 lg:flex-shrink-0">
            <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="text-sm text-gray-500">Loading assignments...</div>}>
                  <AssignmentsList />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}