import { redirect } from "next/navigation";

import { getSession } from "@/lib/server";

import { InterviewEndedView } from "@/modules/interview-ended/ui/view/interview-ended-view";

interface Props {
  params: Promise<{ attemptId: string }>;
}

const Page = async ({ params }: Props) => {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const { attemptId } = await params;

  return <InterviewEndedView attemptId={attemptId} />;
};

export default Page;
