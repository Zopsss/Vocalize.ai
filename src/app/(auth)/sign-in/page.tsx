import { redirect } from "next/navigation";

import { getSession } from "@/lib/server";

import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const Page = async () => {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return <SignInView />;
};

export default Page;
