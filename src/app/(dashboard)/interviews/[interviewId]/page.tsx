import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getSession } from "@/lib/server";

import InterviewIdView, {
  InterviewIdViewError,
  InterviewIdViewLoading,
} from "@/modules/interviews/ui/views/interview-id-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ interviewId: string }>;
}

const Page = async ({ params }: Props) => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { interviewId } = await params;
  prefetch(trpc.interview.getOne.queryOptions({ id: interviewId }));

  return (
    <HydrateClient>
      <Suspense fallback={<InterviewIdViewLoading />}>
        <ErrorBoundary fallback={<InterviewIdViewError />}>
          <InterviewIdView interviewId={interviewId} />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
