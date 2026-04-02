import z from "zod";

export const attemptInsertScehma = z.object({
  name: z.string().min(1, "Interview attempt name is required"),
  interviewId: z.string().min(1, "Interview id is required"),
});

export const attemptUpdateSchema = attemptInsertScehma.extend({
  id: z.string().min(1, "Interview id is required"),

  vapiCallId: z.string().optional(),
  transcript: z.string().optional(),
  recordingS3Url: z.string().optional(),
  feedbackSummary: z.string().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  attempts: z.int().optional(),
});
