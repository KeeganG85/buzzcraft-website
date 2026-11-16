import { ServiceArticle } from "@/components/marketing/ServiceArticle";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

const service = services[0];

export const metadata = pageMetadata({
  title: "Websites",
  description: service.description,
  path: "/services/websites",
});

export default function WebsitesPage() {
  return <ServiceArticle service={service} />;
}
