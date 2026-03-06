import PressureDropGiven from "./PressureDropGiven";
import PressureCorrelated from "./PressureCorrelated";
import { Gauge } from "lucide-react";
  export default function Ten() {
    return (
    <div className="max-w-4xl  mx-auto w-full space-y-3">
      <div className="flex items-center gap-2">
        <Gauge className="w-6 h-6 text-sky-700" />
      <span className="text-xl font-semibold text-gray-700 tracking-wide"> RO element paramteres</span>
      </div> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Section title="when pressure drop is given">
                    <PressureDropGiven/>
                </Section>
                <Section title="when pressure is correlated">
                    <PressureCorrelated/>
                </Section>
            </div>
            </div>
    )
        
}


/* ===== Card Section ===== */

function Section({ children, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden ">

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-500 text-white px-4 py-2 text-sm font-semibold tracking-wide flex items-center gap-2">
         <Gauge className="w-4 h-4" />
        <span className="text-base">
          {title}
        </span>
      </div>

      {/* Body */}
      <div className="p-2">
        {children}
      </div>

    </div>
  );
}