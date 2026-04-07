import { FileText } from "lucide-react";

interface Props {
  attemptName: string;
  transcript: string | null;
  isCompleted: boolean;
}

export const AttemptTranscriptTab = ({
  attemptName,
  transcript,
  isCompleted,
}: Props) => {
  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{attemptName}</h1>
      <h2 className="text-lg font-bold flex items-center gap-2">
        <FileText className="size-5" />
        Full Transcript
      </h2>
      {transcript ? (
        <div className="max-h-[600px] overflow-y-auto pr-2">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {transcript}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {isCompleted
            ? "No transcript available for this attempt."
            : "The full transcript will appear here once the interview is completed and processed."}
        </p>
      )}
    </div>
  );
};
