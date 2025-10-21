'use client'

import { useApiQuery } from '@/integrations/api'
import { Card, CardContent } from '@/_components/ui/card'
import { Badge } from '@/_components/ui/badge'
import { Button } from '@/_components/ui/button'
import { Calendar as CalendarIcon, Users, Clock, ChevronRight } from 'lucide-react'
import type { CourseDto } from '@repo/api/courses/dto'

type Course = CourseDto

function getGradeColor(grade?: string) {
  if (!grade) return 'bg-gray-100 text-gray-800'
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800'
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800'
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}

export function CoursesList() {
  const coursesQuery = useApiQuery<Course[]>(['courses'], '/courses')

  if (coursesQuery.error) return <div className="text-red-600">Failed to load courses</div>
  if (coursesQuery.showLoading) return <div className="text-gray-500">Loading courses...</div>
  if (!coursesQuery.data) return null

  return (
    <div className="space-y-4">
      {coursesQuery.data.map((course) => {
        const codeOrName = course.code || course.title || '--'
        const name = course.title || '--'
        const instructor = 'TBD' // No instructor field in CourseDto
        const description = course.description || '--'
        const semester = 'TBD' // No semester field in CourseDto
        const creditsText = '3' // Default credits
        const gradeText = '--' // No grade field in CourseDto
        const completedText = '--' // No completed field in CourseDto
        const assignmentsText = '--' // No assignments field in CourseDto
        const progressValue = 0 // No progress field in CourseDto
        const progressText = '--'

        return (
        <Card key={course.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: course.color || '#3B82F6' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{codeOrName}</h3>
                    <Badge className={getGradeColor(course.grade)}>
                      {gradeText}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">{name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{instructor}</p>
                  <p className="text-sm text-gray-700 line-clamp-1">{description}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{semester}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{creditsText} credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{completedText}/{assignmentsText} assignments</span>
                  </div>
                </div>
                <div className="w-32">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{progressText}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressValue}%`, backgroundColor: '#3B82F6' }}
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  View Course
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )
      })}
    </div>
  )
}

