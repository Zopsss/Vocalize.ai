import { GetAgent } from "../../types";

import { ResponsiveDialog } from "@/components/responsive-dialog";

import { AgentForm } from "./agent-form";

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: GetAgent;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit agent"
      description="Edit the agent details"
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
