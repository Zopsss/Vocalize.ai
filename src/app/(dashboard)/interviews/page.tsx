import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getSession } from "@/lib/server";

import { loadFiltersSearchParams } from "@/modules/interviews/server/filtersSearchParams";
import { InterviewHeader } from "@/modules/interviews/ui/components/interview-header";
import {
  InterviewView,
  InterviewsViewError,
  InterviewsViewLoading,
} from "@/modules/interviews/ui/views/interview-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  const filters = await loadFiltersSearchParams(searchParams);
  prefetch(trpc.interview.getMany.queryOptions({ ...filters }));

  return (
    <>
      <HydrateClient>
        <Suspense fallback={<InterviewsViewLoading />}>
          <InterviewHeader />
          <ErrorBoundary fallback={<InterviewsViewError />}>
            <InterviewView />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </>
  );
};

export default Page;
