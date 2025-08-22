import Header from '../components/Header';
import Hero from '../components/hero';
import TechnologySections from '../components/TechnologySections';
import FeaturesSection from '../components/FeaturesSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <TechnologySections />
      <FeaturesSection />
    </div>
  );
}