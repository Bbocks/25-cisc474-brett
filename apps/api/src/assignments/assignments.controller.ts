import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import type { AssignmentCreateDto, AssignmentDto, AssignmentUpdateDto } from '@repo/api/assignments/dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<AssignmentDto[]> {
    return this.assignmentsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string): Promise<AssignmentDto | null> {
    return this.assignmentsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: AssignmentCreateDto): Promise<AssignmentDto> {
    return this.assignmentsService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() dto: AssignmentUpdateDto): Promise<AssignmentDto> {
    return this.assignmentsService.update(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ id: string }> {
    return this.assignmentsService.remove(id);
  }
}


