import z from "zod";

export const interviewInsertScehma = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobRole: z.string().min(1, "Job role is required"),
  jobDescription: z.string().min(1, "Job Description is required"),
});

export const interviewUpdateSchema = interviewInsertScehma.extend({
  id: z.string().min(1, "Interview id is required"),
});
