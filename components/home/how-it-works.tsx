"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Factory, Store, ChevronRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MadarSmile } from "@/components/brand/MadarLogo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  title: string;
  desc: string;
}

function NodeCard({
  icon,
  label,
  sub,
  emphasized = false,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  emphasized?: boolean;
}) {
  return (
    <div
      data-flow-node
      className={
        emphasized
          ? "flex w-36 flex-col items-center gap-3 rounded-2xl border-2 border-madar-amber bg-madar-navy px-5 py-6 text-center shadow-lg sm:w-44"
          : "flex w-32 flex-col items-center gap-3 rounded-2xl border border-madar-line bg-white px-4 py-6 text-center shadow-sm sm:w-40"
      }
    >
      <div
        className={
          emphasized
            ? "grid size-12 place-items-center rounded-full bg-white/10 text-madar-amber"
            : "grid size-12 place-items-center rounded-full bg-madar-sand text-madar-trade-blue"
        }
      >
        {icon}
      </div>
      <p className={emphasized ? "text-sm font-bold text-white" : "text-sm font-bold text-madar-navy"}>
        {label}
      </p>
      {sub && <p className="text-[11px] font-medium text-madar-amber">{sub}</p>}
    </div>
  );
}

function FlowDiagram() {
  const tFlow = useTranslations("home.flow");
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const nodes = root.querySelectorAll("[data-flow-node]");
      const connectors = root.querySelectorAll("[data-flow-connector]");

      if (reduceMotion) {
        gsap.set([nodes, connectors], { opacity: 1, scale: 1 });
        return;
      }

      gsap.set(nodes, { opacity: 0, scale: 0.7 });
      gsap.set(connectors, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          once: true,
        },
      });

      nodes.forEach((node, i) => {
        tl.to(node, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, i * 0.28);
        if (connectors[i]) {
          tl.to(connectors[i], { opacity: 1, duration: 0.35 }, i * 0.28 + 0.2);
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex items-center justify-center gap-2 sm:gap-4"
    >
      <NodeCard icon={<Factory className="size-6" />} label={tFlow("manufacturer")} />
      <ChevronRight
        data-flow-connector
        className="size-6 shrink-0 text-madar-line rtl:rotate-180"
        aria-hidden="true"
      />
      <NodeCard
        icon={<MadarSmile className="w-10" />}
        label={tFlow("madar")}
        sub={tFlow("madarSub")}
        emphasized
      />
      <ChevronRight
        data-flow-connector
        className="size-6 shrink-0 text-madar-line rtl:rotate-180"
        aria-hidden="true"
      />
      <NodeCard icon={<Store className="size-6" />} label={tFlow("buyer")} />
    </div>
  );
}

function StepList({ label, steps }: { label: string; steps: Step[] }) {
  return (
    <div>
      <h3 className="mb-5 text-sm font-bold tracking-wide text-madar-trade-blue uppercase">
        {label}
      </h3>
      <ol className="space-y-5">
        {steps.map((step, i) => (
          <ScrollReveal as="li" key={step.title} delay={i * 0.08} className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-madar-navy text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-bold text-madar-navy">{step.title}</p>
              <p className="mt-0.5 text-sm text-madar-muted">{step.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  const t = useTranslations("home.howItWorks");
  const supplierSteps = t.raw("supplierSteps") as Step[];
  const buyerSteps = t.raw("buyerSteps") as Step[];

  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 overflow-x-auto pb-2">
          <div className="min-w-max px-2">
            <FlowDiagram />
          </div>
        </div>

        <div className="mt-20 grid gap-12 border-t border-madar-line pt-14 sm:grid-cols-2">
          <StepList label={t("supplierLabel")} steps={supplierSteps} />
          <StepList label={t("buyerLabel")} steps={buyerSteps} />
        </div>
      </Container>
    </section>
  );
}
