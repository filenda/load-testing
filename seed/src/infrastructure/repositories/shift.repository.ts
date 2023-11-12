import { Injectable } from '@nestjs/common';
import { Shift, Prisma, Profession, Document } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { DocumentDTO } from 'src/shared/dtos/document.dto';
import { WorkerWithDocuments } from '../database/prisma.custom-types';

@Injectable()
export class ShiftRepository {
  constructor(private prisma: PrismaService) {}

  async shift(
    shiftWhereUniqueInput: Prisma.ShiftWhereUniqueInput,
  ): Promise<Shift | null> {
    return this.prisma.shift.findUnique({
      where: shiftWhereUniqueInput,
    });
  }

  async shifts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ShiftWhereUniqueInput;
    where?: Prisma.ShiftWhereInput;
    orderBy?: Prisma.ShiftOrderByWithRelationInput;
  }): Promise<Shift[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.shift.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  eligibleShifts(
    startDate: Date,
    endDate: Date,
    worker: WorkerWithDocuments,
    skip = 0,
    take = 10,
  ): Promise<Shift[]> {
    return this.prisma.shift.findMany({
      where: {
        start: { gte: startDate },
        end: { lte: endDate },
        is_deleted: false,
        worker_id: null,
        profession: worker.profession,
        facility: {
          is_active: true,
          requirements: {
            every: {
              document: {
                id: { in: worker.documents.map((doc) => doc.document.id) },
              },
            },
          },
        },
      },
      take,
      skip,
      include: {
        facility: true,
        worker: true,
      },
    });
  }

  getWorkerClaimedShiftsOnAGivenPeriod(
    workerId: number,
    start: Date,
    end: Date,
  ): Promise<Shift[]> {
    return this.prisma.shift.findMany({
      where: {
        start: { gte: start },
        end: { lte: end },
        is_deleted: false,
        worker_id: workerId,
      },
    });
  }

  async createShift(data: Prisma.ShiftCreateInput): Promise<Shift> {
    return this.prisma.shift.create({
      data,
    });
  }

  async updateShift(params: {
    where: Prisma.ShiftWhereUniqueInput;
    data: Prisma.ShiftUpdateInput;
  }): Promise<Shift> {
    const { where, data } = params;
    return this.prisma.shift.update({
      data,
      where,
    });
  }

  async deleteShift(where: Prisma.ShiftWhereUniqueInput): Promise<Shift> {
    return this.prisma.shift.delete({
      where,
    });
  }
}
