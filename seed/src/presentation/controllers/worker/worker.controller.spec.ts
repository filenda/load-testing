import { Test, TestingModule } from '@nestjs/testing';
import { WorkerController } from './worker.controller';
import { WorkerService } from 'src/domain/services/worker.service';
import { ShiftService } from 'src/domain/services/shift.service';
import { WorkerRepository } from 'src/infrastructure/repositories/worker.repository';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { FacilityService } from 'src/domain/services/facility.service';
import { FacilityRepository } from 'src/infrastructure/repositories/facility.repository';
import { ShiftRepository } from 'src/infrastructure/repositories/shift.repository';

describe('WorkerController', () => {
  let controller: WorkerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkerController],
      providers: [
        PrismaService,
        FacilityRepository,
        ShiftRepository,
        FacilityService,
        WorkerRepository,
        WorkerService,
        ShiftService,
      ],
    }).compile();

    controller = module.get<WorkerController>(WorkerController);
  });

  describe('worker controller', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
});
