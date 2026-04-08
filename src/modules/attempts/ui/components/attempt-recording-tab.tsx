import { Play } from "lucide-react";

import { AudioPlayer } from "./audio-player";

interface Props {
  recordingUrl: string | null;
  isCompleted: boolean;
}

export const AttemptRecordingTab = ({ recordingUrl, isCompleted }: Props) => {
  return (
    <div className="flex flex-col gap-y-6 max-w-lg">
      <h2 className="text-lg font-bold">Recording</h2>
      {recordingUrl ? (
        <AudioPlayer src={recordingUrl} />
      ) : (
        <div className="bg-muted/40 rounded-xl p-12 flex flex-col items-center justify-center gap-3 text-center">
          <Play className="size-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            {isCompleted
              ? "No recording available for this attempt."
              : "The recording will appear here once the interview is completed."}
          </p>
        </div>
      )}
    </div>
  );
};
