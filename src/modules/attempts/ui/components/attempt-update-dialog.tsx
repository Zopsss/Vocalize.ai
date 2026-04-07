import { ResponsiveDialog } from "@/components/responsive-dialog";

import { AttemptNameForm } from "./attempt-name-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attemptId: string;
  initialName: string;
}

export const AttemptUpdateDialog = ({
  open,
  onOpenChange,
  attemptId,
  initialName,
}: Props) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit attempt"
      description="Rename this interview attempt"
    >
      <AttemptNameForm
        attemptId={attemptId}
        initialName={initialName}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
