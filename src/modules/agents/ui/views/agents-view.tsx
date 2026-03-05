"use client";

import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getAllAgents.queryOptions());

  // return <div>{JSON.stringify(data?.agents, null, 2)}</div>;
  return (
    <div className="flex flex-col gap-y-4 flex-1 pb-4 px-4 md:px-8">
      <DataTable columns={columns} data={data} />
      {data.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agents will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take some time"
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
