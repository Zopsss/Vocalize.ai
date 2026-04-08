import { interviewInsertScehma, interviewUpdateSchema } from "../schemas";
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

export const interviewRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await prisma.interview.findFirst({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "failed to get interview",
          });
        }

        return data;
      } catch (error) {
        console.error("Error in interview.getOne: ", error);
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get interview",
        });
      }
    }),

  getMany: protectedProcedure
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
            companyName: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }),
        };

        const [data, total] = await Promise.all([
          prisma.interview.findMany({
            where,
            orderBy: {
              createdAt: "desc",
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
          prisma.interview.count({ where }),
        ]);

        const finalTotal = total > 0 ? total : 1;

        return {
          items: data,
          total: finalTotal,
          page,
          pageSize,
          totalPages: Math.ceil(finalTotal / pageSize),
        };
      } catch (error) {
        console.error("Error in interview.getMany: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get all interviews",
        });
      }
    }),

  create: protectedProcedure
    .input(interviewInsertScehma)
    .mutation(async ({ ctx, input }) => {
      const { companyName, jobRole, jobDescription, resumeId } = input;
      const { user } = ctx.auth;

      try {
        return await prisma.interview.create({
          data: {
            userId: user.id,
            companyName,
            jobRole,
            jobDescription,
            resumeId,
          },
        });
      } catch (error) {
        console.error("Error in interview.create: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create interview",
        });
      }
    }),

  update: protectedProcedure
    .input(interviewUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedInterview = await prisma.interview.update({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
          data: {
            ...input,
          },
        });

        return { data: updatedInterview };
      } catch (error) {
        console.error("Erro in interview.update: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update interview",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const { user } = ctx.auth;

      try {
        const deletedInterview = await prisma.interview.delete({
          where: {
            id,
            userId: user.id,
          },
        });

        return { data: deletedInterview };
      } catch (error) {
        console.error("Error in interview.delete: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete interview",
        });
      }
    }),
});
