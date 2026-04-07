"use client";

import { ArrowRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { GeneratedAvatar } from "@/components/generated-avatar";

interface Props {
  attemptName: string;
  companyName: string;
  jobRole: string;
  jobDescription: string;
  interviewId: string;
  completedAt: Date | null;
  recordingUrl: string | null;
  feedbackSummary: string | null;
  isCompleted: boolean;
}

const formatDuration = (totalSecs: number): string => {
  const secs = Math.round(totalSecs);

  if (secs < 60) return `${secs} second${secs !== 1 ? "s" : ""}`;

  const mins = Math.floor(secs / 60);
  const rem = secs % 60;

  return rem > 0
    ? `${mins} minute${mins !== 1 ? "s" : ""} ${rem} second${rem !== 1 ? "s" : ""}`
    : `${mins} minute${mins !== 1 ? "s" : ""}`;
};

const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const AttemptSummaryTab = ({
  attemptName,
  companyName,
  jobRole,
  jobDescription,
  interviewId,
  completedAt,
  recordingUrl,
  feedbackSummary,
  isCompleted,
}: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onMetadata = () => setDuration(audio.duration);
    audio.addEventListener("loadedmetadata", onMetadata);
    if (!isNaN(audio.duration)) setDuration(audio.duration);

    return () => audio.removeEventListener("loadedmetadata", onMetadata);
  }, [recordingUrl]);

  return (
    <div className="flex flex-col gap-y-6">
      {/* Hidden audio to read duration from metadata */}
      {recordingUrl && (
        <audio
          ref={audioRef}
          src={recordingUrl}
          preload="metadata"
          className="hidden"
        />
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight">{attemptName}</h1>

      {/* Company | role | date */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={companyName}
            className="size-7 shrink-0"
          />
          <span className="text-sm font-medium underline-offset-2">
            {companyName}
          </span>
        </div>
        <span className="text-muted-foreground/40">|</span>
        <span className="text-sm text-muted-foreground">{jobRole}</span>
        {completedAt && (
          <>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(new Date(completedAt))}
            </span>
          </>
        )}
      </div>

      {/* Target role description */}
      <div className="space-y-2 border-t pt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Target Role Description
        </p>
        <p className="text-sm leading-relaxed line-clamp-2">{jobDescription}</p>
        <Link
          href={`/interviews/${interviewId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 hover:text-emerald-600 transition-colors"
        >
          View All Information About This Role
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* General summary label */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="size-4 text-emerald-700" />
        <span>General summary</span>
      </div>

      {/* Duration badge — from audio metadata */}
      {duration !== null && (
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1 w-fit">
          <Clock className="size-3.5" />
          {formatDuration(duration)}
        </div>
      )}

      {/* Overview */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Overview</h2>
        {feedbackSummary ? (
          <p className="text-sm leading-relaxed text-foreground">
            {feedbackSummary}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {isCompleted
              ? "No AI feedback available for this attempt."
              : "The AI summary will appear here once the interview is completed and processed."}
          </p>
        )}
      </div>
    </div>
  );
};
