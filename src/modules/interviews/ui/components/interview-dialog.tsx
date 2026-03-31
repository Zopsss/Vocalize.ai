import { ResponsiveDialog } from "@/components/responsive-dialog";

import { InterviewForm } from "./interview-form";

interface InterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InterviewDialog = ({
  open,
  onOpenChange,
}: InterviewDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Interview"
      description="Create a new interview"
    >
      <InterviewForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
