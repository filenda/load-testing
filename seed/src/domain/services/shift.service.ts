import { Injectable } from '@nestjs/common';
import { Shift } from '@prisma/client';
import { WorkerWithDocuments } from 'src/infrastructure/database/prisma.custom-types';
import { ShiftRepository } from 'src/infrastructure/repositories/shift.repository';
import { EligibleShiftsResponse } from 'src/shared/dtos/eligible-shifts-response.dto';
import { WorkerService } from './worker.service';
import { FacilityService } from './facility.service';
import { EntityNotFoundError } from './common/entity-not-found.error';
import { WorkingShiftsDomainError } from './common/working-shifts-domain-error';
import { DateGroupedEligibleShifts } from 'src/shared/dtos/eligible-shifts-date-grouped-response.dto';

@Injectable()
export class ShiftService {
  constructor(
    private readonly workerService: WorkerService,
    private readonly facilityService: FacilityService,
    private readonly repository: ShiftRepository,
  ) {}

  private async getEligibleShifts(
    startDate: Date,
    endDate: Date,
    worker: WorkerWithDocuments,
    itemsPerPage = 10,
    pageNumber = 1,
  ): Promise<Shift[]> {
    const skip = (pageNumber - 1) * itemsPerPage;

    return await this.repository.eligibleShifts(
      startDate,
      endDate,
      worker,
      skip,
      itemsPerPage,
    );
  }

  async getWorkerClaimedShiftsOnAGivenPeriod(
    workerId: number,
    start: Date,
    end: Date,
  ): Promise<Shift[]> {
    return await this.repository.getWorkerClaimedShiftsOnAGivenPeriod(
      workerId,
      start,
      end,
    );
  }

  async claimShift(shiftId: number, workerId: number) {
    const shift = await this.shift(shiftId);

    if (!shift) {
      throw new WorkingShiftsDomainError('Shift not found');
    }

    const worker = await this.workerService.worker(workerId);

    if (!worker) {
      throw new WorkingShiftsDomainError('Worker not found');
    }

    if (!worker.is_active) {
      throw new WorkingShiftsDomainError('Worker is not active');
    }

    if (shift!.is_deleted) {
      throw new WorkingShiftsDomainError('Shift is not active');
    }

    if (shift!.worker_id) {
      throw new WorkingShiftsDomainError('Shift is claimed already');
    }

    if (worker.profession !== shift!.profession) {
      throw new WorkingShiftsDomainError(
        'Worker profession differs from shift profession',
      );
    }

    const facility = await this.facilityService.facility(shift!.facility_id);

    if (!facility?.is_active) {
      throw new WorkingShiftsDomainError('Facility is not active');
    }

    // Check collisions
    const claimedShifts = await this.getWorkerClaimedShiftsOnAGivenPeriod(
      workerId,
      shift!.start,
      shift!.end,
    );

    if (
      claimedShifts.some((claimedShift) => {
        return this.checkCollisions(shift!, claimedShift);
      })
    ) {
      throw new WorkingShiftsDomainError(
        "This shift collides with one you've claimed",
      );
    }

    shift!.worker_id = workerId;

    await this.repository.updateShift({
      where: { id: shift!.id },
      data: shift!,
    });

    return true;
  }

  shift = async (id: number) => {
    return await this.repository.shift({ id: id });
  };

  getEligibleShiftsForWorker = async (
    workerId: number,
    start?: Date,
    end?: Date,
    itemsPerPage?: number,
    pageNumber?: number,
  ): Promise<EligibleShiftsResponse> => {
    if (!start || !end) {
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
      );
    }

    // 1 - Get the worker's profession and documents
    const worker = await this.workerService.worker(workerId);

    if (!worker) {
      throw new EntityNotFoundError('Worker not found');
    }

    if (!worker.is_active) {
      throw new WorkingShiftsDomainError('Worker is not active');
    }

    // 2 - Get all eligible shifts
    const eligibleShifts = await this.getEligibleShifts(
      start,
      end,
      worker,
      itemsPerPage,
      pageNumber,
    );

    // 3 - Filter out any shifts that collide with shifts the worker has already claimed
    const claimedShifts = await this.getWorkerClaimedShiftsOnAGivenPeriod(
      worker.id,
      start,
      end,
    );

    const eligibleShiftsWithoutCollisions = eligibleShifts.filter((shift) => {
      return !claimedShifts.some((claimedShift) => {
        return this.checkCollisions(shift, claimedShift);
      });
    });

    // 4 - Group eligible shifts by date
    return {
      dateGroupedEligibleShifts: this.groupShiftsByDate(
        eligibleShiftsWithoutCollisions,
      ),
      shiftsCount: eligibleShiftsWithoutCollisions.length,
    };
  };

  private checkCollisions(shiftA: Shift, shiftB: Shift) {
    return shiftA.start <= shiftB.end && shiftB.start <= shiftA.end;
  }

  private groupShiftsByDate(shifts: Shift[]): DateGroupedEligibleShifts[] {
    const eligibleShiftsResponse: DateGroupedEligibleShifts[] = [];

    for (const shift of shifts) {
      const date = shift.start.toISOString().slice(0, 10);

      const shiftsGroup = eligibleShiftsResponse.find((s) => s.date === date);

      if (shiftsGroup) {
        shiftsGroup.shifts.push(shift);
      } else {
        eligibleShiftsResponse.push({ date: date, shifts: [shift] });
      }
    }

    return eligibleShiftsResponse;
  }
}
