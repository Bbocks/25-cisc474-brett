import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { AssignmentCreateDto, AssignmentDto, AssignmentUpdateDto } from '@repo/api/assignments/dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private toAssignmentDto(model: any): AssignmentDto {
    return {
      id: model.id,
      courseId: model.courseId,
      title: model.title,
      description: model.description ?? undefined,
      dueAt: model.dueAt ? model.dueAt.toISOString() : undefined,
    };
  }

  async findAll(): Promise<AssignmentDto[]> {
    const rows = await this.prisma.assignment.findMany();
    return rows.map((r) => this.toAssignmentDto(r));
  }

  async findOne(id: string): Promise<AssignmentDto | null> {
    const row = await this.prisma.assignment.findUnique({ where: { id } });
    return row ? this.toAssignmentDto(row) : null;
  }

  async create(data: AssignmentCreateDto): Promise<AssignmentDto> {
    const created = await this.prisma.assignment.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        description: data.description ?? null,
        dueAt: data.dueAt ? new Date(data.dueAt) : null,
      },
    });
    return this.toAssignmentDto(created);
  }

  async update(data: AssignmentUpdateDto): Promise<AssignmentDto> {
    const updated = await this.prisma.assignment.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description ?? undefined,
        dueAt: data.dueAt === undefined ? undefined : (data.dueAt ? new Date(data.dueAt) : null),
      },
    });
    return this.toAssignmentDto(updated);
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.prisma.assignment.delete({ where: { id } });
    return { id };
  }
}


