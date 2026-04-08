import { Sparkles } from "lucide-react";

export const AttemptAskAiTab = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="size-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
          <Sparkles className="size-5 text-emerald-700" />
        </div>
        <p className="text-sm font-medium">Ask AI about this interview</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Coming soon — you&apos;ll be able to ask questions about your
          performance, get coaching tips, and more.
        </p>
      </div>
    </div>
  );
};
