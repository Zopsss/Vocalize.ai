import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getSession } from "@/lib/server";

import { AttemptsHeader } from "@/modules/attempts/ui/components/attempts-header";
import {
  AttemptsView,
  AttemptsViewError,
  AttemptsViewLoading,
} from "@/modules/attempts/ui/views/attempts-view";
import { loadFiltersSearchParams } from "@/modules/interviews/server/filtersSearchParams";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  const filters = await loadFiltersSearchParams(searchParams);
  prefetch(trpc.interviewAttempts.getMany.queryOptions({ ...filters }));
  prefetch(trpc.resume.get.queryOptions());
  prefetch(trpc.interview.getMany.queryOptions({}));

  return (
    <HydrateClient>
      <AttemptsHeader />
      <Suspense fallback={<AttemptsViewLoading />}>
        <ErrorBoundary fallback={<AttemptsViewError />}>
          <AttemptsView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
