"use client";

import { FileText, Search } from "lucide-react";
import { useState } from "react";
import Highlighter from "react-highlight-words";

import { authClient } from "@/lib/auth-client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type TranscriptMessage = {
  role: "bot" | "user";
  message: string;
  secondsFromStart: number;
};

interface Props {
  transcript: TranscriptMessage[] | null;
  isCompleted: boolean;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const AttemptTranscriptTab = ({ transcript, isCompleted }: Props) => {
  const [search, setSearch] = useState("");
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name ?? "You";
  const userImage = session?.user?.image ?? null;

  const messages = transcript ?? [];
  const filtered = search.trim()
    ? messages.filter((m) =>
        m.message.toLowerCase().includes(search.trim().toLowerCase())
      )
    : messages;

  return (
    <div className="flex flex-col gap-y-6">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <FileText className="size-5" />
        Full Transcript
      </h2>

      {messages.length > 0 ? (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search Transcript"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[600px]">
            <div className="flex flex-col gap-y-3 pr-4">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No results found.
                </p>
              ) : (
                filtered.map((msg, i) => {
                  const isBot = msg.role === "bot";
                  return (
                    <div
                      key={i}
                      className="rounded-lg border bg-muted/40 p-4 flex flex-col gap-y-2"
                    >
                      <div className="flex items-start gap-2">
                        {isBot ? (
                          <GeneratedAvatar
                            seed="AI Interviewer"
                            variant="botttsNeutral"
                            className="size-6"
                          />
                        ) : userImage ? (
                          <Avatar className="size-6">
                            <AvatarImage src={userImage} alt={userName} />
                            <AvatarFallback>
                              {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <GeneratedAvatar
                            seed={userName}
                            variant="initials"
                            className="size-6"
                          />
                        )}
                        <div className="flex flex-col gap-y-1">
                          <div className="flex gap-x-2">
                            <span className="text-sm font-semibold">
                              {isBot ? "AI Interviewer" : "You"}
                            </span>
                            <span className="text-sm font-mono text-blue-500">
                              {formatTimestamp(msg.secondsFromStart)}
                            </span>
                          </div>
                          <Highlighter
                            className="text-sm leading-relaxed"
                            searchWords={search.trim() ? [search.trim()] : []}
                            textToHighlight={msg.message}
                            autoEscape
                            highlightClassName="bg-yellow-200 text-yellow-900 rounded-sm"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </>
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
