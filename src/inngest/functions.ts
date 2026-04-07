import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Output, generateText } from "ai";

import { deleteS3Object, getS3ObjectBuffer } from "@/lib/aws";
import prisma from "@/lib/prisma";

import { inngest } from "./client";
import { ResumeSchema } from "@/constants";
import { env } from "@/env";

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

export const extractResumeText = inngest.createFunction(
  { id: "extract-resume-text", triggers: [{ event: "resume/uploaded" }] },
  async ({ event, step }) => {
    // Step 1: Fetch PDF from S3
    const pdfBase64 = await step.run("fetch-pdf-from-s3", async () => {
      const buffer = await getS3ObjectBuffer(event.data.s3key);
      return buffer.toString("base64");
    });

    // Step 2: Extract text
    const extractionResult = await step.run(
      "extract-text-from-pdf",
      async () => {
        try {
          const pdfParse = (await import("pdf-parse")).default;
          const buffer = Buffer.from(pdfBase64, "base64");
          const result = await pdfParse(buffer);
          return { text: result.text, error: null };
        } catch (err) {
          console.error("PDF Parsing Error:", err);
          return {
            text: null,
            error:
              "Failed to parse PDF. Please ensure the file is a valid PDF document.",
          };
        }
      }
    );

    // Step 3: Early return if extraction failed
    if (extractionResult.error) {
      await step.run("mark-invalid-upload", async () => {
        await deleteS3Object(event.data.s3key);
        await prisma.resume.updateMany({
          where: { userId: event.data.userId },
          data: {
            resumeObject: {
              error: extractionResult.error,
            },
          },
        });
        return { status: "failed", reason: extractionResult.error };
      });

      return { error: extractionResult.error, status: "marked_failed" };
    }

    // Step 4: Clean extracted text
    const cleanedText = await step.run("clean-extracted-text", async () => {
      return extractionResult
        .text!.replace(/[^\x20-\x7E\n]/g, " ") // remove non-ASCII junk characters
        .replace(/[ \t]{2,}/g, " ") // collapse multiple spaces
        .replace(/\n{3,}/g, "\n\n") // collapse excessive newlines
        .trim();
    });

    // Step 5: Parse resume with AI
    const resumeObject = await step.run("parse-resume-with-ai", async () => {
      const { output } = await generateText({
        model: google("gemini-2.5-flash"),
        output: Output.object({ schema: ResumeSchema }),
        system: `You are an expert resume parser. The text was extracted from a PDF and may have
          concatenated words due to multi-column layout. Parse it intelligently.
          If some fields are missing then don't include them.
          If you're not able to parse the resume, or you think the uploaded PDF was not a resume,
          or you don't find anything related to a resume,
          explain the reason behind it in 4-5 words max and store it in the "error" property and do not include other properties in the response.`,
        prompt: `Extract information from the following resume text: \n\n${cleanedText}`,
      });
      return output;
    });

    // Step 6: Early return if AI parsing failed
    if (resumeObject.error) {
      await step.run("mark-invalid-upload", async () => {
        await deleteS3Object(event.data.s3key);
        await prisma.resume.updateMany({
          where: { userId: event.data.userId },
          data: {
            resumeObject: {
              error: resumeObject.error,
            },
          },
        });
        return { status: "failed", reason: resumeObject.error };
      });

      return { error: resumeObject.error, status: "marked_failed" };
    }

    // Step 7: Save to DB
    await step.run("save-to-db", async () => {
      return await prisma.resume.upsert({
        where: { userId: event.data.userId },
        update: { resumeObject },
        create: {
          userId: event.data.userId,
          fileName: event.data.fileName,
          s3key: event.data.s3key,
          resumeObject,
        },
      });
    });

    return { cleanedText, output: resumeObject };
  }
);
