import Hero from '@/components/home/Hero';
import DeliveryStrip from '@/components/home/DeliveryStrip';
import SelectedWork from '@/components/home/SelectedWork';
import { CommercePair, CreativePair, LaboratorySection } from '@/components/home/CreativeTechnology';
import Outcomes from '@/components/home/Outcomes';
import WorkingRelationship from '@/components/home/WorkingRelationship';
import Process from '@/components/home/Process';
import Profile from '@/components/home/Profile';
import FinalCTA from '@/components/home/FinalCTA';

/**
 * Homepage — 10-section persuasion sequence per the brief.
 *
 * 1. Hero            — outcome-led headline, range, clear next action
 * 2. Capability strip — four categories of range
 * 3. Selected work   — IBS + Bharat flagship editorial features
 * 4. Commerce pair   — DeviceDestination + CloudSun
 * 5. Creative pair   — Saffron & Steam + Aarohan Legal (contrast = point)
 * 6. Outcomes        — four client situations, not a service list
 * 7. Working relationship + Process — direct collaboration
 * 8. Profile         — concise, credible
 * 9. Laboratory      — three small experiments
 * 10. Final CTA      — "Show me the problem"
 */
export default function Home() {
  return (
    <>
      <Hero />
      <DeliveryStrip />
      <SelectedWork />
      <CommercePair />
      <CreativePair />
      <Outcomes />
      <WorkingRelationship />
      <Process />
      <Profile />
      <LaboratorySection />
      <FinalCTA />
    </>
  );
}
