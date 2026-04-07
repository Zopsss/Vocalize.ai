"use client";

import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useRef, useState } from "react";

import { ResumeSchemaType } from "@/constants";
import { env } from "@/env";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

interface CallDynamicVariables {
  attemptId: string;
  candidateName: string;
  companyName: string;
  jobRole: string;
  jobDescription: string;
  resumeText: ResumeSchemaType | null | undefined;
}

export interface UseVapiReturn {
  startCall: (overrides: CallDynamicVariables) => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  isSessionActive: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  volumeLevel: number;
  error: string | null;
  messages: Message[];
}

interface UseVapiOptions {
  onCallEnd?: (attemptId: string) => void;
}

export const useVapi = (options?: UseVapiOptions): UseVapiReturn => {
  const vapiRef = useRef<Vapi | null>(null);
  const attemptIdRef = useRef<string | null>(null);
  const onCallEndRef = useRef(options?.onCallEnd);

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    onCallEndRef.current = options?.onCallEnd;
  }, [options?.onCallEnd]);

  useEffect(() => {
    const publicKey = env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

    const instance = new Vapi(publicKey);
    vapiRef.current = instance;

    instance.on("call-start", () => {
      setIsSessionActive(true);
      setIsLoading(false);
      setError(null);
    });

    instance.on("call-end", () => {
      setIsSessionActive(false);
      setIsLoading(false);
      setIsSpeaking(false);
      setVolumeLevel(0);

      const currentAttemptId = attemptIdRef.current;
      if (currentAttemptId) {
        onCallEndRef.current?.(currentAttemptId);
      }
    });

    instance.on("speech-start", () => {
      setIsSpeaking(true);
    });

    instance.on("speech-end", () => {
      setIsSpeaking(false);
    });

    instance.on("volume-level", (level: number) => {
      setVolumeLevel(level);
    });

    instance.on("message", (msg) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          {
            role: msg.role as "user" | "assistant",
            content: msg.transcript,
            timestamp: Date.now(),
          },
        ]);
      }
    });

    instance.on("error", (err) => {
      setError(err?.message || "An error occurred");
      setIsLoading(false);
    });

    return () => {
      instance.stop();
      vapiRef.current = null;
    };
  }, []);

  const startCall = useCallback(
    async ({
      attemptId,
      candidateName,
      companyName,
      jobRole,
      jobDescription,
      resumeText,
    }: CallDynamicVariables) => {
      if (!vapiRef.current) return;
      setIsLoading(true);
      setError(null);
      setMessages([]);

      try {
        const assistantId = env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

        attemptIdRef.current = attemptId;

        await vapiRef.current.start(assistantId, {
          metadata: { attemptId },
          variableValues: {
            candidateName,
            companyName,
            jobRole,
            jobDescription,
            resumeText: JSON.stringify(resumeText),
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start call");
        setIsLoading(false);
      }
    },
    []
  );

  const endCall = useCallback(() => {
    if (!vapiRef.current) return;
    vapiRef.current.stop();
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  }, [isMuted]);

  return {
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
  };
};
