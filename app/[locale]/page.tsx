import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { NeutralityCharter } from "@/components/home/neutrality-charter";
import { AudienceTabs } from "@/components/home/audience-tabs";
import { VisionMap } from "@/components/home/vision-map";
import { Stats } from "@/components/home/stats";
import { FinalCta } from "@/components/home/final-cta";
import { OrbitJourneyLoader } from "@/components/orbit-journey/orbit-journey-loader";

export default function Home() {
  return (
    <>
      <Hero />
      <OrbitJourneyLoader />
      <HowItWorks />
      <NeutralityCharter />
      <AudienceTabs />
      <VisionMap />
      <Stats />
      <FinalCta />
    </>
  );
}
