"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return <div>{JSON.stringify(data?.agents, null, 2)}</div>;
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take some time..."
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error while loading Agents"
      description="Something went wrong"
    />
  );
};
