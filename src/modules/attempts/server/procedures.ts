import { attemptInsertScehma, attemptUpdateSchema } from "../schemas";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { createPresignedStreamUrl } from "@/lib/aws";
import prisma from "@/lib/prisma";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAXIMUM_PAGE_SIZE,
  MINIMUM_PAGE_SIZE,
} from "@/constants";
import { InterviewStatus, Prisma } from "@/generated/prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const attemptRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await prisma.interviewAttempt.findFirst({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
          include: {
            interview: {
              include: {
                resume: true,
              },
            },
          },
        });

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "failed to get interview attempt",
          });
        }

        const recordingUrl = data.recordingS3Url
          ? await createPresignedStreamUrl(data.recordingS3Url)
          : null;

        return { ...data, recordingS3Url: recordingUrl };
      } catch (error) {
        console.error("Error in interview.getOne: ", error);
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get interview attempt",
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
        interviewId: z.string().nullish(),
        status: z
          .enum([
            InterviewStatus.UPCOMING,
            InterviewStatus.COMPLETED,
            InterviewStatus.FAILED,
            InterviewStatus.PROCESSING,
            InterviewStatus.IN_PROGRESS,
          ])
          .nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const { page, pageSize, search, interviewId, status } = input;

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
          prisma.interviewAttempt.findMany({
            where: {
              userId: ctx.auth.user.id,
              ...(search && {
                name: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              }),
              ...(interviewId && {
                interviewId,
              }),
              ...(status && {
                status,
              }),
            },
            orderBy: {
              createdAt: "desc",
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
              interview: {
                select: {
                  id: true,
                  companyName: true,
                  jobRole: true,
                },
              },
            },
          }),
          prisma.interviewAttempt.count({ where }),
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
    .input(attemptInsertScehma)
    .mutation(async ({ ctx, input }) => {
      const { name, interviewId } = input;
      const { user } = ctx.auth;

      try {
        const [attempt] = await prisma.$transaction([
          prisma.interviewAttempt.create({
            data: {
              userId: user.id,
              name,
              interviewId,
            },
          }),
          prisma.interview.update({
            where: { id: interviewId },
            data: { attemptsCount: { increment: 1 } },
          }),
        ]);

        return attempt;
      } catch (error) {
        console.error("Error in interview.create: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create interview",
        });
      }
    }),

  update: protectedProcedure
    .input(attemptUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedInterview = await prisma.interviewAttempt.update({
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
        const deletedInterview = await prisma.interviewAttempt.delete({
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
