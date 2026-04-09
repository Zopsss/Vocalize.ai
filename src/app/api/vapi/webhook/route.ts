import { NextRequest, NextResponse } from "next/server";

import { uploadToS3 } from "@/lib/aws";
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

        try {
          await prisma.interviewAttempt.update({
            where: { id: attemptId },
            data: {
              vapiCallId,
              status: "IN_PROGRESS",
              startedAt: new Date(),
            },
          });
        } catch (err) {
          console.error(
            "[vapi/webhook] Failed to mark attempt as IN_PROGRESS:",
            err
          );
          await prisma.interviewAttempt
            .update({ where: { id: attemptId }, data: { status: "FAILED" } })
            .catch((e) =>
              console.error(
                "[vapi/webhook] Failed to mark attempt as FAILED:",
                e
              )
            );
        }
        break;
      }

      case "end-of-call-report": {
        const vapiCallId = message.call?.id;
        const attemptId = message.call.assistantOverrides.metadata?.attemptId;

        if (!vapiCallId || !attemptId) break;

        const recordingUrl: string | null =
          message.artifact?.recordingUrl ?? null;
        const summary: string | null = message.analysis?.summary ?? null;
        const startedAt: string | null = message.startedAt ?? null;
        const endedAt: string | null = message.endedAt ?? null;

        const rawMessages = Array.isArray(message.artifact?.messages)
          ? message.artifact.messages
          : [];

        const transcript = rawMessages.flatMap((m: unknown) => {
          if (
            !m ||
            typeof m !== "object" ||
            !("role" in m) ||
            !("message" in m) ||
            !("secondsFromStart" in m) ||
            ((m as { role: unknown }).role !== "bot" &&
              (m as { role: unknown }).role !== "user") ||
            typeof (m as { message: unknown }).message !== "string" ||
            typeof (m as { secondsFromStart: unknown }).secondsFromStart !==
              "number"
          ) {
            return [];
          }
          const { role, message, secondsFromStart } = m as {
            role: "bot" | "user";
            message: string;
            secondsFromStart: number;
          };
          return [{ role, message, secondsFromStart }];
        });

        try {
          // Mark as PROCESSING while we handle the recording upload and save
          await prisma.interviewAttempt.update({
            where: { id: attemptId },
            data: { status: "PROCESSING" },
          });

          let recordingS3Key: string | undefined;

          if (recordingUrl) {
            const response = await fetch(recordingUrl);
            if (response.ok) {
              const contentType =
                response.headers.get("content-type") ?? "audio/wav";
              const ext = contentType.includes("mp3")
                ? "mp3"
                : contentType.includes("mpeg")
                  ? "mp3"
                  : "wav";
              const buffer = Buffer.from(await response.arrayBuffer());
              const key = `recordings/${attemptId}.${ext}`;
              await uploadToS3(key, buffer, contentType);
              recordingS3Key = key;
            }
          }

          console.log("startedAt: ", startedAt);
          const interviewDuration =
            startedAt && endedAt
              ? Math.round(
                  (new Date(endedAt).getTime() -
                    new Date(startedAt).getTime()) /
                    1000
                )
              : undefined;

          await prisma.interviewAttempt.update({
            where: { id: attemptId },
            data: {
              vapiCallId,
              status: "COMPLETED",
              transcript: transcript.length > 0 ? transcript : undefined,
              recordingS3Url: recordingS3Key,
              feedbackSummary: summary ?? undefined,
              startedAt: startedAt ? new Date(startedAt) : undefined,
              completedAt: endedAt ? new Date(endedAt) : undefined,
              interviewDuration,
            },
          });
        } catch (err) {
          console.error(
            "[vapi/webhook] Failed to process end-of-call-report:",
            err
          );
          await prisma.interviewAttempt
            .update({ where: { id: attemptId }, data: { status: "FAILED" } })
            .catch((e) =>
              console.error(
                "[vapi/webhook] Failed to mark attempt as FAILED:",
                e
              )
            );
        }
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
