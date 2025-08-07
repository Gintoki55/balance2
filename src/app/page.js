import Header from '../components/Header';
import Hero from '../components/Hero';
import TechnologySections from '../components/TechnologySections';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <TechnologySections />
      <FeaturesSection />
      <Footer />
    </div>
  );
}