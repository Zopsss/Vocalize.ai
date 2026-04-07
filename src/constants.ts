import z from "zod";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAXIMUM_PAGE_SIZE = 100;
export const MINIMUM_PAGE_SIZE = 1;

export const ResumeSchema = z.object({
  summary: z.string().nullish(),
  name: z.string().nullish(),
  email: z.email().nullish(),
  phone: z.string().nullish(),
  education: z
    .array(
      z.object({
        school: z.string(),
        degree: z.string(),
        year: z.string(),
      })
    )
    .nullish(),
  skills: z.record(z.string(), z.array(z.string())).nullish(),
  experience: z
    .array(
      z.object({
        role: z.string(),
        company: z.string(),
        duration: z.string(),
        bullets: z.array(z.string()),
      })
    )
    .nullish(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        techStack: z.array(z.string()),
        description: z.string(),
      })
    )
    .nullish(),
  hackathons: z.array(z.string()).nullish(),
  error: z.string().nullish(),
});

export type ResumeSchemaType = z.infer<typeof ResumeSchema>;
