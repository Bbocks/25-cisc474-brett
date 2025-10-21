'use client'

import { useApiQuery } from '@/integrations/api'
import { Card, CardContent } from '@/_components/ui/card'
import { Badge } from '@/_components/ui/badge'
import type { AssignmentDto } from '@repo/api/assignments/dto'

type Assignment = AssignmentDto

export function AssignmentsList() {
  const assignmentsQuery = useApiQuery<Assignment[]>(['assignments'], '/assignments')

  if (assignmentsQuery.error) return <div className="text-red-600">Failed to load assignments</div>
  if (assignmentsQuery.showLoading) return <div className="text-gray-500">Loading assignments...</div>
  if (!assignmentsQuery.data) return null

  return (
    <div className="space-y-3">
      {assignmentsQuery.data.map((assignment) => {
        const title = assignment.title || '--'
        const courseCode = 'TBD' // No courseCode field in AssignmentDto, would need to fetch course data
        const pointsText = assignment.totalPoints != null ? `${assignment.totalPoints} pts` : '--'
        const dateText = assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : '--'
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

