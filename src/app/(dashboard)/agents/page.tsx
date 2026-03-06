import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getSession } from "@/lib/server";

import { loadFiltersSearchParams } from "@/modules/agents/server/filtersSearchParams";
import { AgentsHeader } from "@/modules/agents/ui/components/agents-header";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  const filters = await loadFiltersSearchParams(searchParams);
  prefetch(trpc.agents.getUserAgents.queryOptions({ ...filters }));

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
