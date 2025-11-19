import * as React from 'react';

export default function FeaturesSection() {
  const features = [
    {
      icon: "/images/cells.png",
      title: 'Custom Design Inputs',
    },
    {
      icon: "/images/water-tank.png",
      title: 'Scenario Simulation',
    },
    {
      icon: "/images/floppy-disk.png",
      title: 'Save & Export Projects',
    }
  ];

  return (
    <section
      className="relative py-8 bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/hero1.jpg")' }}
    >
      <div className="absolute inset-0 bg-black/50 z-20"></div>
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 sm:py-4 lg:px-8 z-30">

        <div className="flex flex-col lg:flex-row lg:items-start gap-4">

          {/* Left Section (Text) */}
          <div className="flex-1 lg:max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Features Built for Precision
            </h2>
            <p className="text-base sm:text-lg text-white">
             Whether you're designing a complex MSF system or exploring RO membrane behavior, this simulator provides the tools you need from input customization to performance analysis.
            </p>
          </div>

          {/* Right Section (Features) */}
          <div className="flex-1 flex justify-around flex-wrap gap-4 sm:flex-row">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1 min-w-[120px] max-w-[160px]"
              >
                <div className="w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 
                                flex items-center justify-center rounded-xl 
                                bg-[#2E5C52] mb-4 overflow-hidden transition-all duration-300 ease-in-out 
                                hover:bg-[#367268] group shadow-md hover:shadow-lg">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    loading='lazy'
                    className="w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 
                               object-contain z-30 transition-transform duration-300 ease-in-out 
                               group-hover:scale-110 invert"
                  />
                </div>
                <h3 className="text-center text-white font-semibold text-sm sm:text-base">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
