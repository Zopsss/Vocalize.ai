import { ResponsiveDialog } from "@/components/responsive-dialog";

import { UserResumeForm } from "./resume-form";

interface UserResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserResumeDialog = ({
  open,
  onOpenChange,
}: UserResumeDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Your Resume"
      description="You can update or remove your resume here"
    >
      <UserResumeForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
