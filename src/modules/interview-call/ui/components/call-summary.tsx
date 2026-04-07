"use client";

import { CallSummaryData } from "@/hooks/useVapi";

/* ─── SVG Icons ─── */
const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface CallSummaryProps {
  data: CallSummaryData;
  isLoading: boolean;
  onClose: () => void;
}

export const CallSummary = ({ data, isLoading, onClose }: CallSummaryProps) => {
  if (isLoading) {
    return (
      <div className="call-summary-overlay">
        <div className="call-summary-panel">
          <div className="summary-loading">
            <div className="summary-spinner" />
            <p className="text-sm text-zinc-400 mt-4">Processing call data…</p>
            <p className="text-xs text-zinc-600 mt-1">
              This may take a few seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasRecording = data.recordingUrl && !!data.recordingUrl.combinedUrl;
  const hasTranscript = data.messages && data.messages.length > 0;
  const hasSummary = !!data.summary;

  return (
    <div className="call-summary-overlay">
      <div className="call-summary-panel">
        {/* Header */}
        <div className="summary-header">
          <div>
            <h2 className="text-lg font-semibold text-white">Call Summary</h2>
            <div className="flex items-center gap-3 mt-1">
              {data.duration && (
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <ClockIcon />
                  {formatDuration(data.duration)}
                </span>
              )}
              <span className="text-xs text-zinc-600">
                {data.status === "ended" ? "Completed" : data.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="summary-close-btn"
            aria-label="Close summary"
            id="close-summary-btn"
          >
            <CloseIcon />
          </button>
        </div>

        {/* AI Summary */}
        {hasSummary && (
          <div className="summary-section">
            <h3 className="summary-section-title">AI Summary</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {data.summary}
            </p>
          </div>
        )}

        {/* Recording */}
        {hasRecording && (
          <div className="summary-section">
            <h3 className="summary-section-title">
              <PlayIcon />
              Recording
            </h3>
            <div className="recording-player">
              <audio
                controls
                src={`${data.recordingUrl.combinedUrl}`}
                className="w-full"
                preload="metadata"
                id="call-recording-player"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}

        {/* Transcript */}
        {hasTranscript && (
          <div className="summary-section">
            <h3 className="summary-section-title">
              Transcript
              <span className="text-xs text-zinc-600 font-normal ml-2">
                {data.messages.length} message
                {data.messages.length !== 1 && "s"}
              </span>
            </h3>
            <div className="summary-transcript">
              {data.messages.map((msg, i) => (
                <div key={i} className={`summary-msg ${msg.role}`}>
                  <div className="summary-msg-header">
                    <span className="summary-msg-role">
                      {msg.role === "user" ? "You" : "Riley"}
                    </span>
                    {msg.secondsFromStart !== undefined && (
                      <span className="summary-msg-time">
                        {formatDuration(Math.round(msg.secondsFromStart))}
                      </span>
                    )}
                  </div>
                  <p className="summary-msg-text">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No data fallback */}
        {!hasRecording && !hasTranscript && !hasSummary && (
          <div className="summary-empty">
            <p className="text-sm text-zinc-500">No call data available yet.</p>
            <p className="text-xs text-zinc-600 mt-1">
              Recording and transcript may take a moment to process.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
