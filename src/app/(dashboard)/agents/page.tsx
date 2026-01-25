import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
  prefetch(trpc.agents.getMany.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
