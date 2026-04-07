"use client";

import { Pause, Play, RotateCcw, RotateCw, Volume2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Props {
  src: string;
}

export const AudioPlayer = ({ src }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play();
    }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const skip = useCallback(
    (seconds: number) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(duration, currentTime + seconds)
      );
    },
    [currentTime, duration]
  );

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (audioRef.current) audioRef.current.currentTime = t;
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div className="bg-muted/40 rounded-xl p-6 flex flex-col gap-5">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Playback buttons */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => skip(-10)}
          aria-label="Skip back 10 seconds"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="size-6" />
        </button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="size-14 rounded-full bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors shadow-lg"
        >
          {isPlaying ? (
            <Pause className="size-6 fill-white" />
          ) : (
            <Play className="size-6 fill-white ml-0.5" />
          )}
        </button>

        <button
          onClick={() => skip(10)}
          aria-label="Skip forward 10 seconds"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCw className="size-6" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-muted">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-emerald-700 pointer-events-none"
            style={{
              width: duration ? `${(currentTime / duration) * 100}%` : "0%",
            }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <Volume2 className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolume}
          className="flex-1 accent-emerald-700 cursor-pointer"
        />
      </div>
    </div>
  );
};
