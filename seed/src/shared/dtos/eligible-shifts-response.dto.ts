import { ApiProperty } from '@nestjs/swagger';
import { ShiftDTO } from './shift.dto';
import { DateGroupedEligibleShifts } from './eligible-shifts-date-grouped-response.dto';

export class EligibleShiftsResponse {
  dateGroupedEligibleShifts: DateGroupedEligibleShifts[];

  shiftsCount: number;
}
