import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';
import { WorkerController } from './presentation/controllers/worker/worker.controller';
import { WorkerRepository } from './infrastructure/repositories/worker.repository';
import { WorkerService } from './domain/services/worker.service';
import { ShiftService } from './domain/services/shift.service';
import { ShiftRepository } from './infrastructure/repositories/shift.repository';
import { FacilityService } from './domain/services/facility.service';
import { FacilityRepository } from './infrastructure/repositories/facility.repository';
import { ShiftController } from './presentation/controllers/shift/shift.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundInterceptor } from './presentation/nest/custom-interceptors/working-shifts.interceptor';

@Module({
  imports: [],
  controllers: [WorkerController, ShiftController],
  providers: [
    PrismaService,
    WorkerService,
    WorkerRepository,
    ShiftService,
    ShiftRepository,
    FacilityService,
    FacilityRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: NotFoundInterceptor,
    },
  ],
})
export class AppModule {}
