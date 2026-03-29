'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import InfoBox from './InfoBox';
import Table from './Table';
import FAQ from './FAQ';
import { Droplet, Gauge, TrendingUp } from 'lucide-react';
import { desalinationData } from '../../(data)/desalinationData';
import HFChat from './hfchat';
import AIAssistant from './hfchat';

export default function Home() {
  const contentRef = useRef(null);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    const html2pdf = (await import('html2pdf.js')).default;

    html2pdf()
      .from(contentRef.current)
      .set({
        margin: 0.5,
        filename: 'desalination-report.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .save();
  };

  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('roa');

  const sectionRefs = {
    overview: useRef(null),
    technology: useRef(null),
    parameters: useRef(null),
    faq: useRef(null),
    references: useRef(null),
  };

  const scrollToSection = (sectionId) => {
    const ref = sectionRefs[sectionId];
    if (ref?.current) {
      const offset = 90;
      const top = ref.current.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(sectionId);
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const [id, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const top = ref.current.offsetTop;
          const bottom = top + ref.current.offsetHeight;

          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentTech = desalinationData.technologies.find(
    (t) => t.id === activeTab
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        title="Media & Tutorials" isPopup 
        onSearch={setSearchTerm}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="max-w-screen-2xl mx-auto flex">
        <Sidebar
          activeSection={activeSection}
          onSectionClick={scrollToSection}
          isOpen={sidebarOpen}
        />

        <main className="flex-1 px-4 md:px-8 py-8 max-w-4xl" ref={contentRef}>
          {/* Overview */}
          <section ref={sectionRefs.overview} id="overview" className="mb-12 scroll-mt-20">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {desalinationData.project.title}
            </h1>

            <div
              className="p-5 rounded-r-lg mb-8 border-l-4"
              style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}
            >
              <p>{desalinationData.project.description}</p>
            </div>

            <div className="h-80 md:h-96 rounded-xl overflow-hidden mb-4">
              <img
                src={desalinationData.project.image}
                alt={desalinationData.project.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm italic mb-8">
              {desalinationData.project.caption}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: Droplet,
                  label: 'Global Capacity',
                  value: desalinationData.statistics.globalCapacity,
                },
                {
                  icon: Gauge,
                  label: 'Active Plants',
                  value: desalinationData.statistics.plantCount,
                },
                {
                  icon: TrendingUp,
                  label: 'RO Stages',
                  value: desalinationData.statistics.stages,
                },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <Icon className="w-6 h-6 mb-2 text-blue-700" />
                    <p className="text-sm">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Technology */}
          <section ref={sectionRefs.technology} id="technology" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Reverse Osmosis Technology
            </h2>

            <div className="mb-6 flex flex-wrap gap-2">
              {desalinationData.technologies.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setActiveTab(tech.id)}
                  className="px-4 py-2 rounded-lg"
                  style={
                    activeTab === tech.id
                      ? { backgroundColor: '#2563eb', color: '#fff' }
                      : { backgroundColor: '#e5e7eb' }
                  }
                >
                  {tech.shortName}
                </button>
              ))}
            </div>

            {currentTech && (
              <div className="p-6 border rounded-xl" style={{ borderColor: '#e5e7eb' }}>
                <h3 className="text-2xl font-bold mb-3">
                  {currentTech.name}
                </h3>
                <p className="mb-6">{currentTech.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className='bg-blue-100 p-4 border border-gray-300 rounded-lg'>
                    <p>Capacity</p>
                    <p className="text-blue-700 font-bold text-xl">{currentTech.capacity}</p>
                  </div>
                  <div className='bg-green-100 p-4 border border-gray-300 rounded-lg'>
                    <p>Recovery</p>
                    <p className='text-green-700 font-bold text-xl'>{currentTech.recovery}</p>
                  </div>
                  <div className='bg-fuchsia-100 p-4 border border-gray-300 rounded-lg'>
                    <p>Pressure</p>
                    <p className='text-fuchsia-700 font-bold text-xl'>{currentTech.pressure}</p>
                  </div>
                </div>
              <h2 className='font-bold mb-2'>Key Features</h2>
               <ul style={{ paddingLeft: '1rem' }}>
                  {currentTech.features.map((f, i) => (
                    <li
                      key={i}
                      style={{
                        color: '#111827',
                        marginBottom:"0.5rem" // لون النص
                      }}
                    >
                      <span style={{ color: '#2563eb' }}>• </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Parameters */}
          <section ref={sectionRefs.parameters} id="parameters" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Technical Parameters</h2>
            <Table parameters={desalinationData.parameters} />
          </section>

          {/* FAQ */}
          <section ref={sectionRefs.faq} id="faq" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <FAQ faqs={desalinationData.faq} />
          </section>

          {/* References */}
          <section ref={sectionRefs.references} id="references" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              References & External Resources
            </h2>

            {desalinationData.links.map((link, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg mb-3"
                style={{ borderColor: '#e5e7eb' }}
              >
                <a href={link.url} target="_blank" rel="noreferrer" style={{color:"#2563eb"}} className='hover:underline'>
                  {link.title}
                </a>
                <p className="text-sm">{link.description}</p>
              </div>
            ))}
          </section>
        </main>
        <AIAssistant/>
        <InfoBox
          statistics={desalinationData.statistics}
          links={desalinationData.links}
          onExportPDF={handleExportPDF}
        />
      </div>
    </div>
  );
}