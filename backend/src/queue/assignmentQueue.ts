import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const assignmentQueue = new Queue('assignment-generation', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

assignmentQueue.on('error', (err) =>
  console.error('[Queue] assignmentQueue error:', err.message)
);

export interface JobData {
  assignmentId: string;
  questionTypes: { type: string; count: number; marks: number }[];
  instructions: string;
  fileUrl?: string;
}

export async function addGenerationJob(
  assignmentId: string,
  data: Omit<JobData, 'assignmentId'>
): Promise<string> {
  const job = await assignmentQueue.add(
    'generate-paper',
    { assignmentId, ...data } satisfies JobData,
    {
      jobId: `assignment-${assignmentId}`,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    }
  );
  return job.id ?? assignmentId;
}
