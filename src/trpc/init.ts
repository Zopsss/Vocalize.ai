import { TRPCError, initTRPC } from "@trpc/server";
import { cache } from "react";

import { getSession } from "@/lib/server";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await getSession();

  if (!session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You're unauthorized to perform this action.",
    });

  return next({ ctx: { ...ctx, auth: session } });
});
