"use client";

import { useConfirm } from "../../hooks/use-confirm";
import InterviewIdHeader from "../components/interview-id-header";
import { UpdateInterviewDialog } from "../components/interview-update-dialog";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/components/error-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";

interface Props {
  interviewId: string;
}

const InterviewIdView = ({ interviewId }: Props) => {
  const [isUpdateInterviewDialogOpen, setIsUpdateInterviewDialogOpen] =
    useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.interview.getOne.queryOptions({ id: interviewId })
  );

  const deleteInterview = useMutation(
    trpc.interview.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.interview.getMany.queryKey(),
        });
        router.push("/interviews");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [InterviewDeleteDialog, confirm] = useConfirm(
    "Are you sure?",
    `This action is irreversible`
  );

  const onDeleteInterview = async () => {
    const ok = await confirm();

    if (!ok) return;

    await deleteInterview.mutateAsync({ id: interviewId });
  };

  return (
    <>
      <InterviewDeleteDialog />
      <UpdateInterviewDialog
        open={isUpdateInterviewDialogOpen}
        onOpenChange={setIsUpdateInterviewDialogOpen}
        initialValues={data}
      />
      <div className="p-4 md:px-8 flex flex-col flex-1 gap-y-4">
        <InterviewIdHeader
          interviewId={interviewId}
          jobRole={data.jobRole}
          companyName={data.companyName}
          onEdit={() => setIsUpdateInterviewDialogOpen(true)}
          onRemove={onDeleteInterview}
        />
        <div className="bg-background rounded-lg border px-4 py-5 space-y-4">
          <div className="flex gap-x-3 items-center">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={data.companyName}
              className="size-10"
            />
            <h2 className="font-medium text-2xl">{data.companyName}</h2>
          </div>
          <div className="flex items-center gap-x-3">
            <p className="text-lg font-medium">Job Role:</p>
            <p className="text-neutral-800">{data.jobRole}</p>
          </div>
          <div className="space-y-3">
            <p className="text-lg font-medium">Job Description</p>
            <p className="text-neutral-800">{data.jobDescription}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const InterviewIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Interview"
      description="This may take some time"
    />
  );
};

export const InterviewIdViewError = () => {
  return (
    <ErrorState
      title="Error while loading the Interview"
      description="Something went wrong"
    />
  );
};

export default InterviewIdView;
