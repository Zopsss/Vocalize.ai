import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type GetOneInterviewAttempt =
  inferRouterOutputs<AppRouter>["interviewAttempts"]["getMany"]["items"][number];
