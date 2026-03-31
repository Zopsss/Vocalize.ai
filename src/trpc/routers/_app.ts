import { createTRPCRouter } from "../init";

import { interviewRouter } from "@/modules/interviews/server/procedures";
import { resumeRouter } from "@/modules/resume/server/procedures";

export const appRouter = createTRPCRouter({
  interview: interviewRouter,
  resume: resumeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
