import { Injectable } from '@nestjs/common';
import { WorkerRepository } from 'src/infrastructure/repositories/worker.repository';

@Injectable()
export class WorkerService {
  constructor(private repository: WorkerRepository) {}

  async worker(id: number) {
    const worker = await this.repository.worker({
      id: id,
    });

    return worker;
  }
}
