import PressureDropGiven from "./ten1";
import PressureCorrelated from "./ten2";

  export default function Ten() {
    return (
    <div className="max-w-7xl w-full space-y-6">
      <h2 className="text-2xl font-bold">
        RO element paramteres
      </h2> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Section>
                    <PressureDropGiven/>
                </Section>
                <Section>
                    <PressureCorrelated/>
                </Section>
            </div>
            </div>
    )
        
}


function Section({ children }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-4">
      {children}
    </div>
  );
}
