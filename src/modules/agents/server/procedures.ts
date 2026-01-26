import { agentsInsertScehma } from "../schemas";
import { TRPCError } from "@trpc/server";
import z from "zod";

import prisma from "@/lib/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
  getAgent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await prisma.agents.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      return { data };
    }),

  getAllAgents: protectedProcedure.query(async () => {
    const data = await prisma.agents.findMany();

    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // throw new TRPCError({ code: "BAD_REQUEST" });

    return { agents: data };
  }),

  create: protectedProcedure
    .input(agentsInsertScehma)
    .mutation(async ({ ctx, input }) => {
      const { name, instructions } = input;
      const { user } = ctx.auth;

      try {
        return await prisma.agents.create({
          data: {
            userId: user.id,
            name,
            instructions,
          },
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create agent",
        });
      }
    }),
});
