import { Prisma } from '@prisma/client';

// 1: Define a type that includes the relation to `Post`
const workerWithDocuments = Prisma.validator<Prisma.WorkerArgs>()({
  include: { documents: { include: { document: true } } },
});

// 3: This type will include a user and all their posts
export type WorkerWithDocuments = Prisma.WorkerGetPayload<
  typeof workerWithDocuments
>;
