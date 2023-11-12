import { Profession, Shift } from '@prisma/client';
import { ProfessionDTO } from './profession.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ShiftDTO implements Shift {
  @ApiProperty()
  id: number;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  profession: Profession;

  // profession: ProfessionDTO;
  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  facility_id: number;

  worker_id: number | null;
}
