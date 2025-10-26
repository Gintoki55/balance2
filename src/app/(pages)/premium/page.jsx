"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Header from '../../../components/Header';
export default function PremiumPage() {
  const plans = [
    {
      name: "Free",
      price: "0$",
      description: "Basic access to simulation previews and limited features.",
      features: ["Access to previews", "Basic training tools", "Community support"],
      button: "Start Free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "19$ / mo",
      description: "Full access to MED, RO, MSF simulations with AI helper.",
      features: [
        "All simulation modules",
        "AI Helper access",
        "Export to Excel & PDF",
        "Save to Dashboard & Project",
      ],
      button: "Get Pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Advanced solutions for enterprises, plants, and institutions.",
      features: [
        "Unlimited simulations",
        "Team collaboration",
        "Custom dashboards",
        "Dedicated support",
      ],
      button: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <>
     <Header />
      <div className="min-h-screen bg-[#F9FAFB] py-12 px-6 bg-hexagons">
     
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800">Premium Access</h1>
        <p className="mt-3 text-lg text-gray-600">
          Unlock full potential of desalination simulators
        </p>
      </motion.div>

      {/* الباقات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className={`rounded-2xl shadow-md border bg-white p-6 flex flex-col 
                        ${plan.highlight ? "border-[#429988] shadow-xl scale-105" : "border-gray-200"}`}
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{plan.name}</h2>
            <p className="text-3xl font-semibold text-[#429988]">{plan.price}</p>
            <p className="text-gray-600 mt-2 mb-6">{plan.description}</p>

            <ul className="space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`mt-6 w-full py-2 rounded-lg font-semibold transition 
                          ${
                            plan.highlight
                              ? "bg-[#429988] text-white hover:bg-[#367c6e]"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
            >
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
    </>
   
  );
}
