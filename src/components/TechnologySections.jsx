"use client";
import * as React from 'react';
import { motion } from 'framer-motion';
// Main Section
export default function TechnologySections() {
  const sections = [
    {
      title: "MED – Multi-Effect Distillation",
      description:
        "A multiple series evaporation and film formation based desalination process with heat reuse. High efficiency with low operating temperatures, reducing the required heating.",
      badges: ['MED', 'MED-AB', 'MED-VC', 'MEDB', 'MEDF', 'MEDX', 'MEDX_AB', 'MVC'],
      image: "/images/b1.png",
    },
    {
      title: "Reverse Osmosis – RO",
      description:
        "A pressure-driven process using semi-permeable membranes to separate salts and impurities from water. Known for high efficiency and scalability.",
      badges: ['RO', 'SWRO', 'BWRO', 'Hybrid-RO'],
      image: "/images/b2.png",
    },
    {
      title: "Multi-Stage Flash – MSF",
      description:
        "Thermal desalination process where seawater is heated and evaporated in multiple stages, producing large-scale fresh water with proven reliability.",
      badges: ['MSF', 'MSF-VC', 'Hybrid-MSF'],
      image: "/images/b3.png",
    },
  ];

return (
<div className="bg-hexagons">
  {sections.map((section, idx) => (
    <motion.section
      key={idx}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: idx * 0.2 }}
      className={`py-8 sm:py-12 lg:py-16 text-black flex flex-col lg:flex-row gap-8 ${
        idx % 2 === 1 ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* النص */}
      <motion.div
        initial={{ opacity: 0, x: idx % 2 === 1 ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center px-6 lg:px-12 w-full lg:w-1/2"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          {section.title}
        </h1>
        <p className="text-gray-700 leading-relaxed mb-6">
          {section.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {section.badges.map((badge, index) => (
            <button 
              key={index}
              className="text-gray-900 border 
                         px-2 py-1 text-md 
                         sm:px-3 sm:py-1.5 sm:text-base 
                         lg:px-4 lg:py-2 bg-gray-200
                         rounded-md hover:border-[#528a87] hover:text-[#528a87] active:bg-[#528a87] active:text-white transition cursor-pointer"
            >
              {badge}
            </button>
          ))}
        </div>
      </motion.div>

      {/* الصورة */}
      <motion.div
        initial={{ opacity: 0, x: idx % 2 === 1 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`relative w-full lg:w-1/2 flex items-center ${
          idx === 1
            ? 'justify-start lg:justify-start px-6 lg:px-12'
            : 'justify-center'
        }`}
      >
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[500px] h-auto object-contain rounded-xl shadow-md"
          src={section.image} 
          alt={section.title} 
        />
      </motion.div>
    </motion.section>
  ))}
</div>

);

}

