import Hero from '@/components/home/Hero';
import DeliveryStrip from '@/components/home/DeliveryStrip';
import SelectedWork from '@/components/home/SelectedWork';
import Services from '@/components/home/Services';
import WorkingRelationship from '@/components/home/WorkingRelationship';
import Process from '@/components/home/Process';
import CreativeTechnology from '@/components/home/CreativeTechnology';
import Profile from '@/components/home/Profile';
import WebsiteReview from '@/components/home/WebsiteReview';
import FinalCTA from '@/components/home/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <DeliveryStrip />
      <SelectedWork />
      <Services />
      <WorkingRelationship />
      <Process />
      <CreativeTechnology />
      <Profile />
      <WebsiteReview />
      <FinalCTA />
    </>
  );
}
