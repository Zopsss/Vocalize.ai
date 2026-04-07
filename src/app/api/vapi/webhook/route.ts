import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import { env } from "@/env";

export async function POST(req: NextRequest) {
  try {
    const secret = env.VAPI_WEBHOOK_SECRET;

    // Validate the webhook secret
    if (secret) {
      const incomingSecret = req.headers.get("x-vapi-secret");
      if (incomingSecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const { message } = body;

    if (!message?.type) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    switch (message.type) {
      case "status-update": {
        if (message.status !== "in-progress") break;

        const vapiCallId = message.call?.id;
        const attemptId = message.call.assistantOverrides.metadata?.attemptId;

        if (!vapiCallId || !attemptId) break;

        await prisma.interviewAttempt.update({
          where: { id: attemptId },
          data: {
            vapiCallId,
            status: "IN_PROGRESS",
            startedAt: new Date(),
          },
        });
        break;
      }

      case "end-of-call-report": {
        const vapiCallId = message.call?.id;
        const attemptId = message.call.assistantOverrides.metadata?.attemptId;

        if (!vapiCallId || !attemptId) break;

        const transcript: string | null = message.artifact?.transcript ?? null;
        const recordingUrl: string | null =
          message.artifact?.recordingUrl ?? null;
        const summary: string | null = message.analysis?.summary ?? null;
        const startedAt: string | null = message.startedAt ?? null;
        const endedAt: string | null = message.endedAt ?? null;

        // console.log("----------MAIN-----------");
        // console.log("---------------------");
        // console.log("recording url:", recordingUrl);
        // console.log("summary:", summary);
        // console.log("startedAt:", startedAt);
        // console.log("endedAt:", endedAt);
        // console.log("transcript:", transcript);
        // console.log("transcript:", transcript);
        // console.log("attemptId:", attemptId);

        // console.log("Message: ", message);

        await prisma.interviewAttempt.update({
          where: { id: attemptId },
          data: {
            vapiCallId,
            status: "COMPLETED",
            transcript: transcript ?? undefined,
            recordingS3Url: recordingUrl ?? undefined,
            feedbackSummary: summary ?? undefined,
            startedAt: startedAt ? new Date(startedAt) : undefined,
            completedAt: endedAt ? new Date(endedAt) : undefined,
          },
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[vapi/webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
