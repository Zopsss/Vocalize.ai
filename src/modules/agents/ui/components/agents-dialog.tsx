import { ResponsiveDialog } from "@/components/responsive-dialog";

import { AgentForm } from "./agent-form";

interface AgentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AgentsDialog = ({ open, onOpenChange }: AgentsDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New agent"
      description="Create a new agent"
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
