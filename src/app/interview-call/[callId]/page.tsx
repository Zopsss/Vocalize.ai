import { InterviewCallView } from "../../../modules/interview-call/ui/view/interview-call-view";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/server";

import { prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ callId: string }>;
}

const Page = async ({ params }: Props) => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { callId } = await params;
  prefetch(trpc.interviewAttempts.getOne.queryOptions({ id: callId }));

  console.log("attemptId from page: ", callId);
  return (
    <InterviewCallView candidateName={session.user.name} callId={callId} />
  );
};

export default Page;
