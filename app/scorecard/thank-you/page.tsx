import Link from "next/link";
import { WhatsAppLink } from "@/components/marketing/WhatsAppLink";
import { Container, buttonClass } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Scorecard request received",
    description: "Your Search Visibility Scorecard request is with BuzzCraft.",
    path: "/scorecard/thank-you",
  }),
  robots: { index: false, follow: false },
};

export default async function ScorecardThankYou({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const saved = params.saved !== "0";

  return (
    <Container className="py-20">
      <p className="eyebrow">Scorecard</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight">
        {saved ? "Request saved. WhatsApp should be open." : "WhatsApp is ready. The request was not stored."}
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-mid">
        {saved
          ? "We have the details you submitted, and WhatsApp should be open with the same note ready to send. A person reviews the 15 points and replies within 48 working hours."
          : "Storage is not configured, or the save failed, so this request is not in the database. Send the WhatsApp message so a person still receives it. Within 48 working hours of that message, you get the findings."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <WhatsAppLink className={buttonClass("primary")} message="Search Visibility Scorecard request">
          Open WhatsApp again
        </WhatsAppLink>
        <Link href="/" className={buttonClass("secondary")}>
          Back home
        </Link>
      </div>
    </Container>
  );
}
