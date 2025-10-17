import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import type { CourseCreateDto, CourseDto, CourseUpdateDto } from '@repo/api/courses/dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Promise<CourseDto[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseDto | null> {
    return this.coursesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CourseCreateDto): Promise<CourseDto> {
    return this.coursesService.create(dto);
  }

  @Patch()
  update(@Body() dto: CourseUpdateDto): Promise<CourseDto> {
    return this.coursesService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ id: string }> {
    return this.coursesService.remove(id);
  }
}


