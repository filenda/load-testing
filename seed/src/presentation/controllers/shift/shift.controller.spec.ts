import { Test, TestingModule } from '@nestjs/testing';
import { ShiftController } from './shift.controller';
import { ShiftService } from 'src/domain/services/shift.service';
import { FacilityService } from 'src/domain/services/facility.service';
import { FacilityRepository } from 'src/infrastructure/repositories/facility.repository';
import { ShiftRepository } from 'src/infrastructure/repositories/shift.repository';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { WorkerService } from 'src/domain/services/worker.service';
import { WorkerRepository } from 'src/infrastructure/repositories/worker.repository';

describe('ShiftController', () => {
  let controller: ShiftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftController],
      providers: [
        WorkerRepository,
        WorkerService,
        PrismaService,
        FacilityRepository,
        FacilityService,
        ShiftRepository,
        ShiftService,
      ],
    }).compile();

    controller = module.get<ShiftController>(ShiftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
