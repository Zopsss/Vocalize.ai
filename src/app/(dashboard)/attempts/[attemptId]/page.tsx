import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getSession } from "@/lib/server";

import {
  AttemptsIdView,
  AttemptsIdViewError,
  AttemptsIdViewLoading,
} from "@/modules/attempts/ui/views/attempts-id-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ attemptId: string }>;
}

const Page = async ({ params }: Props) => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { attemptId } = await params;
  prefetch(trpc.interviewAttempts.getOne.queryOptions({ id: attemptId }));

  return (
    <HydrateClient>
      <Suspense fallback={<AttemptsIdViewLoading />}>
        <ErrorBoundary fallback={<AttemptsIdViewError />}>
          <AttemptsIdView attemptId={attemptId} />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
