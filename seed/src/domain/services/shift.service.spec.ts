import { Test } from '@nestjs/testing';
import { ShiftService } from './shift.service';
import { ShiftRepository } from 'src/infrastructure/repositories/shift.repository';
import { WorkerService } from './worker.service';
import { FacilityService } from './facility.service';
import { EntityNotFoundError } from './common/entity-not-found.error';
import { WorkingShiftsDomainError } from './common/working-shifts-domain-error';
import { Shift, Worker as WorkerModel } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { WorkerRepository } from 'src/infrastructure/repositories/worker.repository';
import { FacilityRepository } from 'src/infrastructure/repositories/facility.repository';

describe('ShiftService', () => {
  let shiftService: ShiftService;
  let shiftRepository: ShiftRepository;
  let workerService: WorkerService;
  let facilityService: FacilityService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FacilityRepository,
        WorkerRepository,
        PrismaService,
        ShiftService,
        ShiftRepository,
        WorkerService,
        FacilityService,
      ],
    }).compile();

    shiftService = moduleRef.get<ShiftService>(ShiftService);
    shiftRepository = moduleRef.get<ShiftRepository>(ShiftRepository);
    workerService = moduleRef.get<WorkerService>(WorkerService);
    facilityService = moduleRef.get<FacilityService>(FacilityService);
  });

  describe('getEligibleShiftsForWorker', () => {
    const worker: WorkerModel = {
      id: 101,
      name: 'Vini Filenga',
      profession: 'CNA',
      is_active: true,
    };

    const activeShift: Shift = {
      is_deleted: false,
      worker_id: null,
      id: 0,
      end: new Date('2023-03-03'),
      start: new Date('2023-02-20'),
      profession: 'CNA',
      facility_id: 0,
    };

    const inactiveShift: Shift = {
      is_deleted: true,
      worker_id: 200,
      id: 0,
      end: new Date('2023-03-03'),
      start: new Date('2023-02-20'),
      profession: 'CNA',
      facility_id: 0,
    };

    it('returns only active and unclaimed shifts', async () => {
      // Create two Shifts, one active and unclaimed, and one inactive and/or claimed

      // Use the ShiftService to get eligible shifts for a given worker
      const eligibleShifts = await shiftService.getEligibleShiftsForWorker(
        worker.id,
        new Date('2023-02-20'),
        new Date('2023-03-03'),
        10,
        1,
      );

      // Expect the result to only contain the active and unclaimed shift
      for (const shift of eligibleShifts.dateGroupedEligibleShifts[0].shifts) {
        expect(shift.worker_id).toBeNull();
        expect(shift.is_deleted).toBe(false);
      }
    });
  });
});
