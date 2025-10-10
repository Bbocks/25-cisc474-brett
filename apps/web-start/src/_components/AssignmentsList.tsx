'use client'

import useSWR from 'swr'
import { apiFetch } from '@/lib/utils'
import { Card, CardContent } from '@/_components/ui/card'
import { Badge } from '@/_components/ui/badge'

type Assignment = {
  id: string
  title: string
  dueDate?: string
  courseCode?: string
  points?: number
  status?: string
}

export function AssignmentsList() {
  const { data, error, isLoading } = useSWR<Assignment[]>(
    '/assignments',
    (path) => apiFetch<Assignment[]>(path),
    { suspense: true, fallbackData: [] }
  )

  if (error) return <div className="text-red-600">Failed to load assignments</div>
  if (!data || isLoading) return null

  return (
    <div className="space-y-3">
      {data.map((assignment) => {
        const title = assignment.title || '--'
        const courseCode = assignment.courseCode || '--'
        const pointsText = assignment.points != null ? `${assignment.points} pts` : '--'
        const dateText = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '--'
        return (
          <Card key={assignment.id}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-gray-600">{courseCode}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{dateText}</p>
                <Badge variant="outline" className="text-xs">{pointsText}</Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

