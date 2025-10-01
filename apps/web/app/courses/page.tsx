'use client'

import { Suspense, useState } from 'react'
import Header from '@/_components/header'
import { Input } from '@/_components/ui/input'
import { Search } from 'lucide-react'
import { CoursesList } from '../_components/CoursesList'

export const dynamic = 'force-dynamic'

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">My Courses</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Suspense fallback={<div className="text-sm text-gray-500">Loading courses...</div>}>
          <CoursesList />
        </Suspense>
      </div>
    </div>
  )
}
