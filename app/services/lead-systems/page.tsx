import { ServiceArticle } from "@/components/marketing/ServiceArticle";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

const service = services[2];

export const metadata = pageMetadata({
  title: "Lead systems",
  description: service.description,
  path: "/services/lead-systems",
});

export default function LeadSystemsPage() {
  return <ServiceArticle service={service} />;
}
