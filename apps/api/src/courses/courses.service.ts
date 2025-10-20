import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { CourseDto, CourseCreateDto, CourseUpdateDto } from '@repo/api/courses/dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private toCourseDto(model: any): CourseDto {
    return {
      id: model.id,
      code: model.code,
      title: model.title,
      description: model.description ?? undefined,
      startDate: model.startDate ? model.startDate.toISOString() : undefined,
      endDate: model.endDate ? model.endDate.toISOString() : undefined,
      createdAt: model.createdAt.toISOString(),
    };
  }

  async findAll(): Promise<CourseDto[]> {
    try {
      const rows = await this.prisma.course.findMany();
      return rows.map((r) => this.toCourseDto(r));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch courses via Prisma. Likely a missing table or migration on the deployed DB.', error);
      throw new ServiceUnavailableException('Courses are temporarily unavailable');
    }
  }

  async findOne(id: string): Promise<CourseDto | null> {
    const model = await this.prisma.course.findUnique({ where: { id } });
    return model ? this.toCourseDto(model) : null;
  }

  async create(data: CourseCreateDto): Promise<CourseDto> {
    const created = await this.prisma.course.create({
      data: {
        code: data.code,
        title: data.title,
        description: data.description ?? null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    return this.toCourseDto(created);
  }

  async update(data: CourseUpdateDto): Promise<CourseDto> {
    const updated = await this.prisma.course.update({
      where: { id: data.id },
      data: {
        code: data.code,
        title: data.title,
        description: data.description ?? undefined,
        startDate: data.startDate === undefined ? undefined : (data.startDate ? new Date(data.startDate) : null),
        endDate: data.endDate === undefined ? undefined : (data.endDate ? new Date(data.endDate) : null),
      },
    });
    return this.toCourseDto(updated);
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.prisma.course.delete({ where: { id } });
    return { id };
  }
}


