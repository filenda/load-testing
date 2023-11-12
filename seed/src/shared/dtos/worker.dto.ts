import { Worker } from '@prisma/client';
import { DocumentDTO } from './document.dto';

export interface WorkerDTO extends Worker {
  documents: Array<DocumentDTO>;
}
