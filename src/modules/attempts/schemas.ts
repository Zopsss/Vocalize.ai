import z from "zod";

export const attemptInsertScehma = z.object({
  name: z.string().min(1, "Interview attempt name is required"),
  interviewId: z.string().min(1, "Interview id is required"),
});

export const attemptUpdateSchema = attemptInsertScehma.extend({
  id: z.string().min(1, "Interview id is required"),
  interviewId: z.string().optional(),
});
