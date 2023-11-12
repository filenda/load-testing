import { ApiProperty } from '@nestjs/swagger';
import { ShiftDTO } from './shift.dto';

export class DateGroupedEligibleShifts {
  @ApiProperty()
  date: string;

  shifts: ShiftDTO[];
}
