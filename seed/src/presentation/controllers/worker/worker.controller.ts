import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Worker as WorkerModel, Shift as ShiftModel } from '@prisma/client';
import { ShiftService } from 'src/domain/services/shift.service';
import { WorkerService } from 'src/domain/services/worker.service';
import { WorkerRepository } from 'src/infrastructure/repositories/worker.repository';

import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedDTO } from 'src/shared/dtos/common/paginated.dto';
import { ShiftDTO } from 'src/shared/dtos/shift.dto';
import { DateGroupedEligibleShifts } from 'src/shared/dtos/eligible-shifts-date-grouped-response.dto';

@ApiTags('worker')
@Controller()
export class WorkerController {
  constructor(
    private readonly workerRepository: WorkerRepository,
    private readonly workerService: WorkerService,
    private readonly shiftService: ShiftService,
  ) {}

  @Get('worker/:id')
  async getWorkerById(@Param('id') id: string): Promise<WorkerModel | null> {
    return this.workerRepository.worker({ id: Number(id) });
  }

  @Get('worker/:id/eligibleShifts')
  @ApiExtraModels(PaginatedDTO)
  @ApiExtraModels(DateGroupedEligibleShifts)
  @ApiExtraModels(ShiftDTO)
  @ApiOkResponse({
    description: 'Successful return payload',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDTO) },
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(DateGroupedEligibleShifts) },
            },
          },
        },
      ],
    },
  })
  async getWorkerEligibleShifts(
    @Param('id', ParseIntPipe) id: number,
    @Query('itemsPerPage', new DefaultValuePipe(10), ParseIntPipe)
    itemsPerPage: number,
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe)
    pageNumber: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<PaginatedDTO<DateGroupedEligibleShifts>> {
    const dateTypedStart = start ? new Date(start) : undefined;
    const dateTypedEnd = end ? new Date(end) : undefined;

    const eligibleShifts = await this.shiftService.getEligibleShiftsForWorker(
      id,
      dateTypedStart,
      dateTypedEnd,
      itemsPerPage,
      pageNumber,
    );

    return {
      itemsPerPage: itemsPerPage,
      pageNumber: pageNumber,
      totalItems: eligibleShifts.shiftsCount,
      results: eligibleShifts.dateGroupedEligibleShifts,
    };
  }

  @Post('worker')
  async signupWorker(
    @Body()
    workerData: {
      name: string;
      is_active?: boolean;
      profession: 'CNA' | 'LVN' | 'RN';
    },
  ): Promise<WorkerModel> {
    return this.workerRepository.createWorker(workerData);
  }
}
