import { agentsInsertScehma } from "../schemas";
import { TRPCError } from "@trpc/server";
import z from "zod";

import prisma from "@/lib/prisma";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAXIMUM_PAGE_SIZE,
  MINIMUM_PAGE_SIZE,
} from "@/constants";
import { Prisma } from "@/generated/prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
  getAgent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await prisma.agents.findFirst({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });

        return data;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get agent",
        });
      }
    }),

  getUserAgents: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MINIMUM_PAGE_SIZE)
          .max(MAXIMUM_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().trim().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const { page, pageSize, search } = input;

        const where = {
          userId: ctx.auth.user.id,
          ...(search && {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }),
        };

        const [data, total] = await Promise.all([
          prisma.agents.findMany({
            where,
            orderBy: {
              createdAt: "desc",
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
          prisma.agents.count({ where }),
        ]);

        return {
          items: data,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get all agents",
        });
      }
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
