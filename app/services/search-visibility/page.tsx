import { ServiceArticle } from "@/components/marketing/ServiceArticle";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

const service = services[1];

export const metadata = pageMetadata({
  title: "Search visibility",
  description: service.description,
  path: "/services/search-visibility",
});

export default function SearchVisibilityPage() {
  return <ServiceArticle service={service} />;
}
