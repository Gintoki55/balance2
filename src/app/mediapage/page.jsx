"use client";
import StationHeader from "@/components/stationheader";
import Link from "next/link";

export default function MediaPage() {
  const faqItems = [
    {
      question: "What is this system?",
      answer:
        "This system is an educational simulation designed to explain how reverse osmosis simulation works.",
    },
    {
      question: "How can I use the videos?",
      answer:
        "You can watch the main video to understand the basics, then explore the additional videos for more details.",
    },
    {
      question: "Is this simulation interactive?",
      answer:
        "Yes, some videos demonstrate how to interact with the simulation step by step.",
    },
  ];

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <StationHeader title="Media & Tutorials" />

      <div className="p-4 sm:p-6 space-y-16 max-w-6xl mx-auto">

        {/* Title and Intro Video */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Learn About the Simulation System
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Watch the introduction video to understand how the simulation works
            and how to use it effectively.
          </p>
          <div className="w-full max-w-4xl mx-auto rounded-xl shadow-xl overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Intro Tutorial"
              loading="lazy"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video"
            ></iframe>
          </div>
        </div>

        {/* System Overview and Types */}
        <div className="space-y-6 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">
            What is the system and its types?
          </h2>
          <p className="text-gray-600">
            This system provides educational simulations for different processes
            such as reverse osmosis, multi-effect distillation, and more. The
            goal is to teach users how to safely and effectively work with these
            systems.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Reverse Osmosis Simulation (RO Simulation)</li>
            <li>Multi-Effect Distillation Simulation (MED Simulation)</li>
            <li>Advanced Water & Wastewater Process Simulations</li>
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Frequently Asked Questions</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center sm:text-left"
              >
                <h3 className="font-semibold text-gray-800">{item.question}</h3>
                <p className="text-gray-600 mt-2">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Button */}
        <div className="text-center">
          <Link href="/contact">
            <button
              className="bg-[#429988] text-white px-8 py-3 rounded-lg shadow-lg text-lg 
                         hover:bg-[#367c6e] transition active:scale-95"
            >
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
