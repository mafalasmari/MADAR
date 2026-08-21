import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SupplyChainBackground } from "@/components/home/supply-chain-background";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-madar-navy py-20 sm:py-24">
      <SupplyChainBackground />
      <Container className="relative">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold tracking-wide text-madar-amber uppercase">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-bold text-balance text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg text-pretty text-madar-on-navy-muted">
              {subtitle}
            </p>
          )}
        </ScrollReveal>
      </Container>
    </section>
  );
}
