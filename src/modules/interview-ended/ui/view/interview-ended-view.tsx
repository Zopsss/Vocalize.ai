"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { useTRPC } from "@/trpc/client";

interface Props {
  attemptId: string;
}

export const InterviewEndedView = ({ attemptId }: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery({
    ...trpc.interviewAttempts.getOne.queryOptions({ id: attemptId }),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "FAILED") return false;
      return 3000;
    },
  });

  const status = data?.status;
  const isProcessing =
    !status || status === "IN_PROGRESS" || status === "PROCESSING";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0f] px-4 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-8">
        {/* Icon */}
        <div
          className={`flex items-center justify-center w-20 h-20 rounded-full border ${
            isFailed
              ? "bg-red-500/10 border-red-500/20"
              : "bg-indigo-500/10 border-indigo-500/20"
          }`}
        >
          {isProcessing ? (
            <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
          ) : isFailed ? (
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-400"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-400"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            {isProcessing
              ? "Processing Your Interview…"
              : isFailed
                ? "Processing Failed"
                : "Interview Complete"}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            {isProcessing
              ? "Your session has ended. Hang tight while we process your recording, transcript, and feedback."
              : isFailed
                ? "Something went wrong while processing your session. Your attempt has been saved."
                : "Your results are ready — head to your attempt page to review the transcript, recording, and AI feedback."}
          </p>
        </div>

        {/* Processing indicator card */}
        {isProcessing && (
          <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-5 flex flex-col gap-4 text-left">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              What happens next
            </p>
            <ul className="flex flex-col gap-3">
              {[
                {
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  ),
                  label: "Recording",
                  description:
                    "Your full interview recording will be attached to this attempt.",
                },
                {
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  ),
                  label: "Transcript",
                  description:
                    "A full word-for-word transcript of the conversation.",
                },
                {
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  ),
                  label: "AI Feedback",
                  description:
                    "An AI-generated summary and performance insights.",
                },
              ].map(({ icon, label, description }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 text-indigo-400">
                    {icon}
                  </span>
                  <span className="text-sm text-zinc-300">
                    <span className="font-medium text-white">{label}</span>
                    {" — "}
                    {description}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-zinc-600 mt-1">
              Processing typically completes within a minute or two.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href={`/attempts/${attemptId}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-3 transition-colors"
          >
            View Attempt
          </Link>
          <Link
            href="/attempts"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium px-5 py-3 transition-colors"
          >
            All Attempts
          </Link>
        </div>
      </div>
    </div>
  );
};
