import { redirect } from "next/navigation";
import { studioSession } from "@/lib/studio";

export const dynamic = "force-dynamic";

export default async function PrivateStudioLayout({ children }: { children: React.ReactNode }) {
  const session = await studioSession();
  if (!session) redirect("/studio/login/");
  return <>{children}</>;
}
