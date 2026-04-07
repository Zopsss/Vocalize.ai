"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { useVapi } from "@/hooks/useVapi";
import { useTRPC } from "@/trpc/client";

/* ─── SVG Icons ─── */
const PhoneIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PhoneOffIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const MicIcon = () => (
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
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const MicOffIcon = () => (
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
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

interface Props {
  candidateName: string;
  callId: string;
}

export const InterviewCallView = ({ candidateName, callId }: Props) => {
  const router = useRouter();

  const onCallEnd = useCallback(
    (attemptId: string) => {
      router.push(`/interview-ended/${attemptId}`);
    },
    [router]
  );

  const {
    startCall,
    endCall,
    toggleMute,
    isSessionActive,
    isLoading,
    isMuted,
    isSpeaking,
    volumeLevel,
    error,
    messages,
  } = useVapi({ onCallEnd });

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.interviewAttempts.getOne.queryOptions({ id: callId })
  );

  const { interview } = data;

  const transcriptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  const getOrbClass = () => {
    if (!isSessionActive && !isLoading) return "voice-orb inactive";
    if (isLoading) return "voice-orb connecting";
    if (isSpeaking) return "voice-orb speaking";
    return "voice-orb idle";
  };

  const getOrbScale = () => {
    if (isSpeaking && isSessionActive) {
      return 1 + volumeLevel * 0.25;
    }
    return 1;
  };

  const getStatusText = () => {
    if (error) return error;
    if (isLoading) return "Connecting to Riley…";
    if (!isSessionActive) return "Tap to start a conversation";
    if (isSpeaking) return "Riley is speaking…";
    return "Listening…";
  };

  const getStatusDotClass = () => {
    if (error) return "status-dot error";
    if (isLoading) return "status-dot connecting";
    if (isSessionActive) return "status-dot connected";
    return "status-dot";
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#0a0a0f] px-4 py-8 overflow-hidden relative">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center gap-2 pt-4">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Riley
        </h1>
        <div className="flex items-center gap-2">
          <span className={getStatusDotClass()} />
          <span className="text-xs text-zinc-500">
            {isSessionActive ? "Connected" : "Ready"}
          </span>
        </div>
      </header>

      {/* Center: Orb + Status */}
      <div className="relative z-10 flex flex-col items-center gap-8 flex-1 justify-center">
        <div className="orb-container">
          {/* Ripple rings */}
          <div
            className={`ripple-ring ${isSpeaking && isSessionActive ? "active" : ""}`}
          />
          <div
            className={`ripple-ring ${isSpeaking && isSessionActive ? "active" : ""}`}
          />
          <div
            className={`ripple-ring ${isSpeaking && isSessionActive ? "active" : ""}`}
          />

          {/* Main orb */}
          <div
            className={getOrbClass()}
            style={{ transform: `scale(${getOrbScale()})` }}
          />
        </div>

        {/* Status text */}
        <p className="text-sm text-zinc-400 text-center max-w-xs">
          {getStatusText()}
        </p>
      </div>

      {/* Transcript */}
      {messages.length > 0 && (
        <div className="relative z-10 w-full max-w-md mb-6">
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Transcript
              </span>
              <span className="text-xs">
                {messages.length} message{messages.length !== 1 && "s"}
              </span>
            </div>
            <div
              ref={transcriptRef}
              className="transcript-container flex flex-col gap-2 max-h-48 overflow-y-auto"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message-bubble ${msg.role} text-white`}
                >
                  <span className="text-[10px] uppercase tracking-wider block mb-1">
                    {msg.role === "user" ? "You" : "Riley"}
                  </span>
                  {msg.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 flex items-center gap-6 pb-8">
        {/* Mute button (only visible during call) */}
        {isSessionActive && (
          <button
            onClick={toggleMute}
            className={`control-btn mute-btn ${isMuted ? "muted" : ""}`}
            aria-label={isMuted ? "Unmute" : "Mute"}
            id="mute-btn"
          >
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </button>
        )}

        {/* Call button */}
        <button
          onClick={
            isSessionActive
              ? endCall
              : () =>
                  startCall({
                    attemptId: callId,
                    candidateName,
                    companyName: interview.companyName,
                    jobRole: interview.jobRole,
                    jobDescription: interview.jobDescription,
                    resumeText: interview.resume?.resumeObject,
                  })
          }
          disabled={isLoading}
          className={`control-btn call-btn ${isSessionActive ? "active" : ""}`}
          aria-label={isSessionActive ? "End call" : "Start call"}
          id="call-btn"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isSessionActive ? (
            <PhoneOffIcon />
          ) : (
            <PhoneIcon />
          )}
        </button>

        {/* Spacer to keep call button centered when mute is visible */}
        {isSessionActive && <div className="w-12 h-12" />}
      </div>

      {/* Error banner */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center backdrop-blur-md">
          {error}
        </div>
      )}
    </div>
  );
};
