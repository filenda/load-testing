import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ParsePagingPipe {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageNumber?: number;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  itemsPerPage?: number;
}
