import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import type { CourseCreateDto, CourseDto, CourseUpdateDto } from '@repo/api/courses/dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<CourseDto[]> {
    return this.coursesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseDto | null> {
    return this.coursesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CourseCreateDto): Promise<CourseDto> {
    return this.coursesService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() dto: CourseUpdateDto): Promise<CourseDto> {
    return this.coursesService.update(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ id: string }> {
    return this.coursesService.remove(id);
  }
}


