import { Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { PrismaClient } from '@repo/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      // Log the underlying error for diagnostics and surface a clear 503 upstream
      // eslint-disable-next-line no-console
      console.error('Prisma connect failed. Check DATABASE_URL/DIRECT_URL and network/SSL settings.', error);
      throw new ServiceUnavailableException('Database connection failed');
    }
  }
}
