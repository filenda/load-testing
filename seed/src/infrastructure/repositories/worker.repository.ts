import { Injectable } from '@nestjs/common';
import { Worker, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { WorkerWithDocuments } from '../database/prisma.custom-types';

@Injectable()
export class WorkerRepository {
  constructor(private prisma: PrismaService) {}

  async worker(
    userWhereUniqueInput: Prisma.WorkerWhereUniqueInput,
  ): Promise<WorkerWithDocuments | null> {
    return this.prisma.worker.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        name: true,
        profession: true,
        is_active: true,
        documents: {
          include: { document: true },
        },
      },
    });
  }

  async workers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.WorkerWhereUniqueInput;
    where?: Prisma.WorkerWhereInput;
    orderBy?: Prisma.WorkerOrderByWithRelationInput;
  }): Promise<Worker[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.worker.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createWorker(data: Prisma.WorkerCreateInput): Promise<Worker> {
    return this.prisma.worker.create({
      data,
    });
  }

  async updateWorker(params: {
    where: Prisma.WorkerWhereUniqueInput;
    data: Prisma.WorkerUpdateInput;
  }): Promise<Worker> {
    const { where, data } = params;
    return this.prisma.worker.update({
      data,
      where,
    });
  }

  async deleteWorker(where: Prisma.WorkerWhereUniqueInput): Promise<Worker> {
    return this.prisma.worker.delete({
      where,
    });
  }
}
