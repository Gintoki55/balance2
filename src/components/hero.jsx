"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden z-10">
      {/* الخلفية المتحركة */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-top"
        loading="lazy"
        style={{ backgroundImage: "url('/images/hero1.jpg')" }}
        initial={{ scale: 1.2, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          scale: { duration: 3, ease: "easeOut" }      // zoom أبطأ
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-20"></div>

      {/* المحتوى */}
      <div className="relative max-w-10xl mx-auto px-4 sm:px-6 lg:px-28 h-full flex items-center z-50">
        <div className="text-white max-w-full lg:max-w-4xl lg:h-[300px] sm:h-[250px] max-sm:h-[200px] flex justify-between flex-col">
          
          {/* العنوان */}
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            Simulate the Future<br />
            of Desalination
          </motion.h1>

          {/* الفقرة */}
          <motion.p 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-4 sm:mb-6 lg:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          >Simulate, design, and analyze advanced desalination systems from Multi-Stage Flash to Reverse Osmosis using an interactive platform built for innovation and education.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
