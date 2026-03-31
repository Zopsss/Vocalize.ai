import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { extractResumeText } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [extractResumeText],
});
