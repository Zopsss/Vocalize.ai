import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  createPresignedDownloadUrl,
  createPresignedUrlWithClient,
  deleteS3Object,
} from "@/lib/aws";
import prisma from "@/lib/prisma";

import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const resumeRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return prisma.resume.findUnique({
      where: { userId: ctx.auth.user.id },
    });
  }),

  getPresignedUrl: protectedProcedure
    .input(z.object({ contentType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.contentType !== "application/pdf") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only PDF files are allowed",
        });
      }

      const resume = await prisma.resume.findUnique({
        where: { userId: ctx.auth.user.id },
      });

      let key: string;

      // if resume already exists then we need to replace the old resume with new one.
      if (resume) {
        key = resume.s3key; // re-using the old s3key so the old resume gets replaced, in-place of inserting a new resume.
      } else {
        key = `resumes/${ctx.auth.user.id}/${uuidv4()}.pdf`; // the s3key is generated only once
      }

      const url = await createPresignedUrlWithClient(key, input.contentType);
      return { url, key };
    }),

  getDownloadUrl: protectedProcedure.query(async ({ ctx }) => {
    const resume = await prisma.resume.findUnique({
      where: { userId: ctx.auth.user.id },
    });

    if (!resume) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Resume not found" });
    }

    const url = await createPresignedDownloadUrl(resume.s3key, resume.fileName);
    return { url };
  }),

  save: protectedProcedure
    .input(z.object({ key: z.string(), fileName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { key, fileName } = input;
      const userId = ctx.auth.user.id;

      if (!key.startsWith(`resumes/${userId}/`)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid file key",
        });
      }

      const savedResume = prisma.resume.upsert({
        where: { userId },
        update: { fileName, s3key: key },
        create: { userId, fileName, s3key: key },
      });

      await inngest.send({
        name: "resume/uploaded",
        data: {
          userId,
          s3key: key,
          fileName,
        },
      });

      return savedResume;
    }),

  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const resume = await prisma.resume.findUnique({ where: { userId } });

    if (!resume) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resume not found",
      });
    }

    await deleteS3Object(resume.s3key);
    await prisma.resume.delete({ where: { userId } });

    return { deletedKey: resume.s3key };
  }),
});
