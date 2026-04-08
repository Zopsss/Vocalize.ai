"use client";

import { AttemptAskAiTab } from "../components/attempt-ask-ai-tab";
import { AttemptIdHeader } from "../components/attempt-id-header";
import { AttemptRecordingTab } from "../components/attempt-recording-tab";
import { AttemptSummaryTab } from "../components/attempt-summary-tab";
import { AttemptTranscriptTab } from "../components/attempt-transcript-tab";
import { AttemptUpdateDialog } from "../components/attempt-update-dialog";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { BookOpen, FileText, Mic, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { useConfirm } from "@/modules/interviews/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";

interface Props {
  attemptId: string;
}

export const AttemptsIdView = ({ attemptId }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.interviewAttempts.getOne.queryOptions({ id: attemptId })
  );

  const deleteAttempt = useMutation(
    trpc.interviewAttempts.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interviewAttempts.getMany.queryOptions({})
        );
        router.push("/attempts");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete attempt?",
    "This action is irreversible and will permanently delete this interview attempt."
  );

  const onDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteAttempt.mutate({ id: attemptId });
  };

  const {
    name,
    status,
    completedAt,
    startedAt,
    feedbackSummary,
    transcript,
    recordingS3Url,
    interview,
  } = data;

  const isCompleted = status === "COMPLETED";

  const TABS = [
    {
      label: "Summary",
      icon: <BookOpen className="size-4" />,
      component: (
        <AttemptSummaryTab
          companyName={interview.companyName}
          jobRole={interview.jobRole}
          jobDescription={interview.jobDescription}
          interviewId={interview.id}
          completedAt={completedAt ? new Date(completedAt) : null}
          recordingUrl={recordingS3Url}
          feedbackSummary={feedbackSummary}
          isCompleted={isCompleted}
        />
      ),
    },
    {
      label: "Transcript",
      icon: <FileText className="size-4" />,
      component: (
        <AttemptTranscriptTab
          transcript={
            transcript as Array<{
              role: "bot" | "user";
              message: string;
              secondsFromStart: number;
            }> | null
          }
          isCompleted={isCompleted}
        />
      ),
    },
    {
      label: "Recording",
      icon: <Mic className="size-4" />,
      component: (
        <AttemptRecordingTab
          recordingUrl={recordingS3Url}
          isCompleted={isCompleted}
        />
      ),
    },
    {
      label: "Ask AI",
      icon: <Sparkles className="size-4" />,
      component: <AttemptAskAiTab />,
    },
  ];

  return (
    <>
      <DeleteDialog />
      <AttemptUpdateDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        attemptId={attemptId}
        initialName={name}
      />

      <div className="flex flex-col flex-1">
        <AttemptIdHeader
          attemptId={attemptId}
          attemptName={name}
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={onDelete}
        />

        <div className="mx-4 mb-6 md:mx-6 bg-background rounded-xl border flex flex-col flex-1 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b overflow-x-auto">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  activeIndex === i
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active tab content */}
          <div className="p-6 md:p-8 flex-1">{TABS[activeIndex].component}</div>
        </div>
      </div>
    </>
  );
};

export const AttemptsIdViewLoading = () => (
  <LoadingState
    title="Loading Interview Attempt"
    description="This may take some time"
  />
);

export const AttemptsIdViewError = () => (
  <ErrorState
    title="Error while loading the Interview Attempt"
    description="Something went wrong"
  />
);
