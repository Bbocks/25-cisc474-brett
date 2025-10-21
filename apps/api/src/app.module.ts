import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ProblemsModule } from './problems/problems.module';
import { ProblemTestCasesModule } from './problem-test-cases/problem-test-cases.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { NotebookSubmissionsModule } from './notebook-submissions/notebook-submissions.module';
import { FileUploadsModule } from './file-uploads/file-uploads.module';
import { FeedbackModule } from './feedback/feedback.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    LinksModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    AssignmentsModule,
    ProblemsModule,
    ProblemTestCasesModule,
    SubmissionsModule,
    NotebookSubmissionsModule,
    FileUploadsModule,
    FeedbackModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
