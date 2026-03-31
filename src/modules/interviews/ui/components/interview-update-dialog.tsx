import { GetInterview } from "../../types";

import { ResponsiveDialog } from "@/components/responsive-dialog";

import { InterviewForm } from "./interview-form";

interface UpdateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: GetInterview;
}

export const UpdateInterviewDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateInterviewDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit interview"
      description="Edit the interview details"
    >
      <InterviewForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
