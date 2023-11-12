import { Injectable } from '@nestjs/common';
import { Facility, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FacilityRepository {
  constructor(private prisma: PrismaService) {}

  async facility(
    userWhereUniqueInput: Prisma.FacilityWhereUniqueInput,
  ): Promise<Facility | null> {
    return this.prisma.facility.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        name: true,
        is_active: true,
      },
    });
  }

  async facilitys(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FacilityWhereUniqueInput;
    where?: Prisma.FacilityWhereInput;
    orderBy?: Prisma.FacilityOrderByWithRelationInput;
  }): Promise<Facility[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.facility.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createFacility(data: Prisma.FacilityCreateInput): Promise<Facility> {
    return this.prisma.facility.create({
      data,
    });
  }

  async updateFacility(params: {
    where: Prisma.FacilityWhereUniqueInput;
    data: Prisma.FacilityUpdateInput;
  }): Promise<Facility> {
    const { where, data } = params;
    return this.prisma.facility.update({
      data,
      where,
    });
  }

  async deleteFacility(
    where: Prisma.FacilityWhereUniqueInput,
  ): Promise<Facility> {
    return this.prisma.facility.delete({
      where,
    });
  }
}
