"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";

import { CreateAttemptForm } from "./create-attempt-form";

interface InterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAttemptDialog = ({
  open,
  onOpenChange,
}: InterviewDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create a new Attempt"
      description="Attempt a mock interview"
    >
      <CreateAttemptForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
