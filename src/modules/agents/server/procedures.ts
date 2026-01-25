import prisma from "@/lib/prisma";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await prisma.agents.findMany();

    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // throw new TRPCError({ code: "BAD_REQUEST" });

    return { agents: data };
  }),
});
