import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import type { AssignmentCreateDto, AssignmentDto, AssignmentUpdateDto } from '@repo/api/assignments/dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  findAll(): Promise<AssignmentDto[]> {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AssignmentDto | null> {
    return this.assignmentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: AssignmentCreateDto): Promise<AssignmentDto> {
    return this.assignmentsService.create(dto);
  }

  @Patch()
  update(@Body() dto: AssignmentUpdateDto): Promise<AssignmentDto> {
    return this.assignmentsService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ id: string }> {
    return this.assignmentsService.remove(id);
  }
}


