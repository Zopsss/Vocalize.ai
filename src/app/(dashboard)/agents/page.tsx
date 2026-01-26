import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getSession } from "@/lib/server";

import { AgentsHeader } from "@/modules/agents/ui/components/agents-header";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  prefetch(trpc.agents.getAllAgents.queryOptions());

  return (
    <>
      <AgentsHeader />
      <HydrateClient>
        <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </>
  );
};

export default Page;
