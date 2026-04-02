import { createTRPCRouter } from "../init";

import { attemptRouter } from "@/modules/attempts/server/procedures";
import { interviewRouter } from "@/modules/interviews/server/procedures";
import { resumeRouter } from "@/modules/resume/server/procedures";

export const appRouter = createTRPCRouter({
  interview: interviewRouter,
  interviewAttempts: attemptRouter,
  resume: resumeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
