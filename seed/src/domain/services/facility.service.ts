import { Injectable } from '@nestjs/common';
import { FacilityRepository } from 'src/infrastructure/repositories/facility.repository';

@Injectable()
export class FacilityService {
  constructor(private repository: FacilityRepository) {}

  async facility(id: number) {
    const facility = await this.repository.facility({
      id: id,
    });

    return facility;
  }
}
