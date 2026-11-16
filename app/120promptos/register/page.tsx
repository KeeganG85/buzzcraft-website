import { ProductNav } from "@/components/prompt-os/ProductNav";
import { RegisterForm } from "@/components/prompt-os/RegisterForm";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Register for the 120 Prompt OS",
    description: "Register to unlock the full 120 Prompt OS instructions.",
    path: "/120promptos/register",
  }),
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <Container className="py-16">
      <ProductNav />
      <h1 className="text-4xl font-semibold tracking-tight">Register to unlock the library</h1>
      <p className="mt-4 max-w-xl leading-7 text-mid">
        We store your first name, work email, business name and a short description of the business.
        Marketing email is a separate tick. If storage is not configured, the library stays locked
        rather than pretending you have access.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </Container>
  );
}