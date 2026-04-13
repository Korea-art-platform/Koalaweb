import AboutHero from '@/app/components/About/AboutHero';
import AboutMission from '@/app/components/About/AboutMission';
import AboutTimeline from '@/app/components/About/AboutTimeline';
import AboutCTA from '@/app/components/About/AboutCTA';

export default function About() {
  return (
    <main className="bg-white font-sans">
      <AboutHero />
      <AboutMission />
      {/* TeamSection 등은 나중에 필요할 때 추가로 분리 가능 */}
      <AboutTimeline />
      <AboutCTA />
    </main>
  );
}