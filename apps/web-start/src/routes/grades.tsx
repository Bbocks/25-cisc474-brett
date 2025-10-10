import { useState } from "react";
import Header from "@/_components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { 
  ArrowLeft,
  TrendingUp,
  BookOpen,
  Calendar,
  FileText,
  Award,
  Target,
  BarChart3
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute('/grades')({
  component: GradesPage,
})

// Mock grades data - in a real app this would come from your database
const mockGrades = [
  {
    id: '1',
    courseCode: 'CISC 474',
    courseName: 'Web Development',
    instructor: 'Dr. Sarah Johnson',
    semester: 'Fall 2024',
    currentGrade: 'A-',
    overallProgress: 75,
    assignments: [
      {
        id: '1',
        name: 'HTML/CSS Fundamentals',
        type: 'Assignment',
        dueDate: '2024-09-15',
        submittedDate: '2024-09-14',
        pointsEarned: 95,
        pointsPossible: 100,
        grade: 'A',
        status: 'graded',
        weight: 10
      },
      {
        id: '2',
        name: 'JavaScript Basics',
        type: 'Lab',
        dueDate: '2024-09-22',
        submittedDate: '2024-09-21',
        pointsEarned: 88,
        pointsPossible: 100,
        grade: 'B+',
        status: 'graded',
        weight: 10
      },
      {
        id: '3',
        name: 'React Components',
        type: 'Project',
        dueDate: '2024-10-05',
        submittedDate: '2024-10-04',
        pointsEarned: 92,
        pointsPossible: 100,
        grade: 'A-',
        status: 'graded',
        weight: 15
      },
      {
        id: '4',
        name: 'Midterm Exam',
        type: 'Exam',
        dueDate: '2024-10-15',
        submittedDate: '2024-10-15',
        pointsEarned: 87,
        pointsPossible: 100,
        grade: 'B+',
        status: 'graded',
        weight: 20
      },
      {
        id: '5',
        name: 'Node.js Backend',
        type: 'Assignment',
        dueDate: '2024-11-10',
        submittedDate: '2024-11-09',
        pointsEarned: 94,
        pointsPossible: 100,
        grade: 'A',
        status: 'graded',
        weight: 10
      },
      {
        id: '6',
        name: 'Database Integration',
        type: 'Lab',
        dueDate: '2024-11-20',
        submittedDate: '2024-11-19',
        pointsEarned: 90,
        pointsPossible: 100,
        grade: 'A-',
        status: 'graded',
        weight: 10
      },
      {
        id: '7',
        name: 'Final Project',
        type: 'Project',
        dueDate: '2024-12-15',
        submittedDate: null,
        pointsEarned: null,
        pointsPossible: 100,
        grade: null,
        status: 'pending',
        weight: 25
      }
    ],
    gradeBreakdown: {
      assignments: { earned: 367, possible: 400, percentage: 91.75 },
      exams: { earned: 87, possible: 100, percentage: 87 },
      projects: { earned: 92, possible: 100, percentage: 92 },
      labs: { earned: 178, possible: 200, percentage: 89 }
    }
  }
];

const getGradeColor = (grade: string | null) => {
  if (!grade) return 'bg-gray-100 text-gray-800';
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'graded': return 'bg-green-100 text-green-800';
    case 'submitted': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'late': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Exam': return <Award className="h-4 w-4" />;
    case 'Project': return <Target className="h-4 w-4" />;
    case 'Lab': return <BookOpen className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

export default function GradesPage() {
  const [selectedCourse] = useState(mockGrades[0]!); // In a real app, this would be from URL params
  const [sortBy, setSortBy] = useState('dueDate');

  const sortedAssignments = [...selectedCourse.assignments].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'grade':
        if (!a.grade || !b.grade) return 0;
        return b.grade.localeCompare(a.grade);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const gradedAssignments = selectedCourse.assignments.filter(a => a.status === 'graded');
  const totalEarned = gradedAssignments.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  const totalPossible = gradedAssignments.reduce((sum, a) => sum + a.pointsPossible, 0);
  const overallPercentage = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;

  return (
    <div>
      <Header />
      <div className="mx-auto px-4 py-8 max-w-screen-2xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/courses">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{selectedCourse.courseCode}</h1>
              <p className="text-lg text-gray-600">{selectedCourse.courseName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Instructor: {selectedCourse.instructor}</span>
            <span>•</span>
            <span>{selectedCourse.semester}</span>
          </div>
        </div>

        {/* Grade Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Grade</p>
                  <p className="text-2xl font-bold">{selectedCourse.currentGrade}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall %</p>
                  <p className="text-2xl font-bold">{overallPercentage.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                  <p className="text-2xl font-bold">{totalEarned}/{totalPossible}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold">{selectedCourse.overallProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grade Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Grade Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(selectedCourse.gradeBreakdown).map(([category, data]) => (
                <div key={category} className="text-center">
                  <h4 className="font-medium capitalize mb-2">{category}</h4>
                  <div className="text-2xl font-bold mb-1">{data.percentage.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">{data.earned}/{data.possible} points</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignments Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assignments & Grades</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="grade">Grade</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Assignment</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Due Date</th>
                    <th className="text-left py-3 px-2">Submitted</th>
                    <th className="text-left py-3 px-2">Points</th>
                    <th className="text-left py-3 px-2">Grade</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAssignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium">{assignment.name}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(assignment.type)}
                          <span className="text-sm">{assignment.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm">
                          {assignment.submittedDate 
                            ? new Date(assignment.submittedDate).toLocaleDateString()
                            : 'Not submitted'
                          }
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm">
                          {assignment.pointsEarned !== null 
                            ? `${assignment.pointsEarned}/${assignment.pointsPossible}`
                            : `--/${assignment.pointsPossible}`
                          }
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {assignment.grade ? (
                          <Badge className={getGradeColor(assignment.grade)}>
                            {assignment.grade}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm">{assignment.weight}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
