import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotebookSubmissionsService } from './notebook-submissions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notebook-submissions')
export class NotebookSubmissionsController {
  constructor(private readonly notebookSubmissionsService: NotebookSubmissionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.notebookSubmissionsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notebookSubmissionsService.findOne(id);
  }
}


