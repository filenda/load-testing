import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Shift as ShiftModel } from '@prisma/client';
import { ShiftService } from 'src/domain/services/shift.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('shift')
@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Get(':id')
  async getShiftById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShiftModel | null> {
    return this.shiftService.shift(id);
  }

  @Post(':id/claim/worker/:workerId')
  async claimShift(
    @Param('id', ParseIntPipe) id: number,
    @Param('workerId', ParseIntPipe) workerId: number,
  ): Promise<boolean> {
    //TODO: Take workerId From JWT claim instead of path var
    return this.shiftService.claimShift(id, workerId);
  }
}
