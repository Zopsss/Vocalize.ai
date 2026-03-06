"use client";

import AgentIdHeader from "../components/agent-id-header";
import { useSuspenseQuery } from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";

import { ErrorState } from "@/components/error-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";

import { useTRPC } from "@/trpc/client";

interface Props {
  agentId: string;
}

const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getAgent.queryOptions({ id: agentId })
  );

  return (
    <div className="p-4 md:px-8 flex flex-col flex-1 gap-y-4">
      <AgentIdHeader
        agentName={data.name}
        agentId={agentId}
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <div className="bg-white rounded-lg border px-4 py-5 space-y-4">
        <div className="flex gap-x-3 items-center">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={data.name}
            className="size-10"
          />
          <h2 className="font-medium text-2xl">{data.name}</h2>
        </div>
        <Badge
          variant={"outline"}
          className="[&>svg:size-4] flex items-center gap-x-2"
        >
          <VideoIcon className="text-blue-700" />5 meetings
          {/* TODO: add meetingCount to DB */}
          {/* {data.meetingCount} {data.meetingCount > 1 ? "meetings" : "meeting"} */}
        </Badge>
        <div className="space-y-3">
          <p className="text-lg font-medium">Instructions</p>
          <p className="text-neutral-800">{data.instructions}</p>
        </div>
      </div>
    </div>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <LoadingState title="Loading Agent" description="This may take some time" />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error while loading the Agent"
      description="Something went wrong"
    />
  );
};

export default AgentIdView;
