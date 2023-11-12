import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDTO<TData> {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  itemsPerPage: number;

  results: TData[];
}
