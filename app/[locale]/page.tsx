import { Preloader } from "@/components/home/preloader";
import { Hero } from "@/components/home/hero";
import { Problem } from "@/components/home/problem";
import { Solution } from "@/components/home/solution";
import { Ecosystem } from "@/components/home/ecosystem";
import { FoundingPartners } from "@/components/home/founding-partners";
import { OrbitJourneyLoader } from "@/components/orbit-journey/orbit-journey-loader";

export default function Home() {
  return (
    <>
      <Preloader />
      <Hero />
      <Problem />
      <Solution />
      <div id="journey">
        <OrbitJourneyLoader />
      </div>
      <Ecosystem />
      <FoundingPartners />
    </>
  );
}
