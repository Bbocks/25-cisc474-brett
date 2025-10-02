import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.course.findMany();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch courses via Prisma. Likely a missing table or migration on the deployed DB.', error);
      throw new ServiceUnavailableException('Courses are temporarily unavailable');
    }
  }

  findOne(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }
}


