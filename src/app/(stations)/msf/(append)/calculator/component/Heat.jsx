
"use client";
import Tooltip from "@/components/Tooltip";
import { Gauge } from "lucide-react";
import { useState } from "react";

const INFO = {
   "Th1":"Hot side inlet temperature",
   "Tc2":"Cold side inlet temperature",
   "Ux":"Heat exchanger heat transfer coefficient",
   "NTU":"Number of Transfer Units",
   "Cr":"Heat capacity rate ratio (Cmin/Cmax)",
   "ε":"Heat exchanger effectiveness",
    "°C": "Celsius",
    "Tc1":"Cold side inlet temperature",
    "Q":"Heat duty",
    "A":"Heat transfer area",
    "Ucorr":"Correlated overall heat transfer coefficient",
    "LMTD":"Log mean temperature difference",
    "U":"Tested overall heat transfer coefficient",
    "K":"Heat transfer correction factor by testing",
    "ho":"Outside convective heat transfer coefficient ho, For condensation h≈ 44 MJ/m².h.°C,For pool evaporation h≈ 12 MJ/m².h.°C,For film falling evaporation h≈ 33 MJ/m².h.°C, For water velocity 1m/s h≈ 7 MJ/m².h.°C,For water velocity 2m/s h≈ 12 MJ/m².h.°C, For water velocity 3m/s h≈ 20 MJ/m².h.°C",
    "FFo":"Outside fouling resistances FFo,about 0.08 ~ 0.2",
    "δ":"Wall thickness δ,about 0.001 ~ 0.002 m",
    "σ":"Outer to inner tube radius ratio σ = Do/Di",
    "FFi":"Inside fouling resistances FFi,about 0.08 ~ 0.2",
    "hi":"Inside convective heat transfer coefficient hi,For condensation h≈ 44 MJ/m².h.°C,For pool evaporation h≈ 12 MJ/m².h.°C,For film falling evaporation h≈ 33 MJ/m².h.°C,For water velocity 1m/s h≈ 7 MJ/m².h.°C,For water velocity 2m/s h≈ 12 MJ/m².h.°C,For water velocity 3m/s h≈ 20 MJ/m².h.°C",
    "MJ/m².h.°C":"Megajoule per square meter per hour per degree Celsius",
    "m².h.°C/MJ":"Square meter hour degree Celsius per megajoule",
    "m":"Meter",
    "MJ/m.h.°C":"Megajoule per meter per hour per degree Celsius",
    "#":"Dimensionless",



};
export default function Heat() {

// ===== Table 1 =====
const [Th1, setTh1] = useState(70);
const [Tc2, setTc2] = useState(25);

const Tmean = 0.5 * (Th1 + Tc2);
const Ux = 5.76 + 0.00576 * Tmean + 576e-6 * Math.pow(Tmean, 2);


// ===== Table 2 =====
const [NTU, setNTU] = useState(2.0);
const [Cr, setCr] = useState(0.8);

const effectiveness = Cr === 1 
  ? NTU / (1 + NTU)
  : (1 - Math.exp(-NTU * (1 - Cr))) / (1 - Cr * Math.exp(-NTU * (1 - Cr)));


// ===== Table 3 =====
const [Th1_3, setTh1_3] = useState(70);
const [Th2, setTh2] = useState(35);
const [Tc1, setTc1] = useState(65);
const [Tc2_3, setTc2_3] = useState(32);
const [Q, setQ] = useState(700);
const [A, setA] = useState(25);
const [Ur, setUr] = useState(8.9856);

const dT1 = Th1_3 - Tc1;
const dT2 = Th2 - Tc2_3;

const lmtd = Math.abs(dT1 - dT2) < 0.001 
  ? dT1 
  : (dT1 - dT2) / Math.log(dT1 / dT2);

const Ut = A > 0 && lmtd > 0 ? Q / (A * lmtd) : 0;
const K = Ur > 0 ? Ut / Ur : 0;


// ===== Table 4 =====
const [hi, setHi] = useState(44);
const [FFi, setFFi] = useState(0.01);
const [delta, setDelta] = useState(0.001);
const [k, setKval] = useState(0.432);
const [sigma, setSigma] = useState(1.087);
const [FFo, setFFo] = useState(0.01);
const [ho, setHo] = useState(12);
const [Ur2, setUr2] = useState(8.9856);

const resistance =
  (hi > 0 ? 1 / hi : 0) +
  FFi +
  (k > 0 ? delta / k : 0) +
  sigma * FFo +
  (ho > 0 ? sigma / ho : 0);

const Uth = resistance > 0 ? 1 / resistance : 0;
const K2 = Ur2 > 0 ? Uth / Ur2 : 0;


// ===== Helpers =====
const allowNumber = (value, setter) => {
  if (/^-?\d*\.?\d*$/.test(value)) setter(value);
};

const formatOnBlur = (value, setter) => {
  if (value === "" || value === "-") return;
  const n = Number(value);
  if (!isNaN(n)) setter(n);
};


return (
<div className="max-w-4xl mx-auto w-full space-y-3">

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* ===== Table 1 ===== */}
<Section title="Heat Exchanger Correlation">
  <RowInput label="Th1" unit="°C" value={Th1}
    onChange={(e)=>allowNumber(e.target.value,setTh1)}
    onBlur={()=>formatOnBlur(Th1,setTh1)} />

  <RowInput label="Tc2" unit="°C" value={Tc2}
    onChange={(e)=>allowNumber(e.target.value,setTc2)}
    onBlur={()=>formatOnBlur(Tc2,setTc2)} />

  <RowView label="Ux" value={(Ux).toFixed(4)} unit="MJ/m².h.°C"/>
</Section>


{/* ===== Table 2 ===== */}
<Section title="Counterflow Heat Exchanger Effectiveness">
  <RowInput label="NTU" unit="#" value={NTU}
    onChange={(e)=>allowNumber(e.target.value,setNTU)}
    onBlur={()=>formatOnBlur(NTU,setNTU)} />

  <RowInput label="Cr" unit="#" value={Cr}
    onChange={(e)=>allowNumber(e.target.value,setCr)}
    onBlur={()=>formatOnBlur(Cr,setCr)} />

  <RowView label="ε" value={(effectiveness).toFixed(4)} unit="#"/>
</Section>


{/* ===== Table 3 ===== */}
<Section title="Heat Transfer Correction Factor K (By Testing)">
  <RowInput label="Th1" unit="°C" value={Th1_3}
    onChange={(e)=>allowNumber(e.target.value,setTh1_3)}
    onBlur={()=>formatOnBlur(Th1_3,setTh1_3)} />

  <RowInput label="Th2" unit="°C" value={Th2}
    onChange={(e)=>allowNumber(e.target.value,setTh2)}
    onBlur={()=>formatOnBlur(Th2,setTh2)} />

  <RowInput label="Tc1" unit="°C" value={Tc1}
    onChange={(e)=>allowNumber(e.target.value,setTc1)}
    onBlur={()=>formatOnBlur(Tc1,setTc1)} />

  <RowInput label="Tc2" unit="°C" value={Tc2_3}
    onChange={(e)=>allowNumber(e.target.value,setTc2_3)}
    onBlur={()=>formatOnBlur(Tc2_3,setTc2_3)} />

  <RowInput label="Q" unit="MJ/h" value={Q}
    onChange={(e)=>allowNumber(e.target.value,setQ)}
    onBlur={()=>formatOnBlur(Q,setQ)} />

  <RowInput label="A" unit="m²" value={A}
    onChange={(e)=>allowNumber(e.target.value,setA)}
    onBlur={()=>formatOnBlur(A,setA)} />

  <RowInput label="Ucorr" unit="MJ/m².h.°C" value={Ur}
    onChange={(e)=>allowNumber(e.target.value,setUr)}
    onBlur={()=>formatOnBlur(Ur,setUr)} />

  <RowView label="LMTD" value={(lmtd).toFixed(4)} unit="°C"/>
  <RowView label="U" value={(Ut).toFixed(4)} unit="MJ/m².h.°C"/>
  <RowView label="K" value={(K).toFixed(4)} unit="#"/>
</Section>


{/* ===== Table 4 ===== */}
<Section title="Heat Transfer Correction Factor K (By Theory)">
  <RowInput label="ho" unit="MJ/m².h.°C" value={ho}
    onChange={(e)=>allowNumber(e.target.value,setHo)}
    onBlur={()=>formatOnBlur(ho,setHo)} />

  <RowInput label="FFo" unit="m².h.°C/MJ" value={FFo}
    onChange={(e)=>allowNumber(e.target.value,setFFo)}
    onBlur={()=>formatOnBlur(FFo,setFFo)} />

  <RowInput label="δ" unit="m" value={delta}
    onChange={(e)=>allowNumber(e.target.value,setDelta)}
    onBlur={()=>formatOnBlur(delta,setDelta)} />

  <RowInput label="k" unit="MJ/m.h.°C" value={k}
    onChange={(e)=>allowNumber(e.target.value,setKval)}
    onBlur={()=>formatOnBlur(k,setKval)} />

  <RowInput label="σ" unit="#" value={sigma}
    onChange={(e)=>allowNumber(e.target.value,setSigma)}
    onBlur={()=>formatOnBlur(sigma,setSigma)} />

  <RowInput label="FFi" unit="m².h.°C/MJ" value={FFi}
    onChange={(e)=>allowNumber(e.target.value,setFFi)}
    onBlur={()=>formatOnBlur(FFi,setFFi)} />

  <RowInput label="hi" unit="MJ/m².h.°C" value={hi}
    onChange={(e)=>allowNumber(e.target.value,setHi)}
    onBlur={()=>formatOnBlur(hi,setHi)} />

  <RowInput label="Ucorr" unit="MJ/m².h.°C" value={Ur2}
    onChange={(e)=>allowNumber(e.target.value,setUr2)}
    onBlur={()=>formatOnBlur(Ur2,setUr2)} />

  <RowView label="U" value={(Uth).toFixed(4)} unit="MJ/m².h.°C"/>
  <RowView label="K" value={(K2).toFixed(4)} unit="#"/>
</Section>

</div>
</div>
);
}


/* ===== Card Section ===== */

function Section({ children, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

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
function RowInput({ label, unit, value, onChange, onBlur, autoFocus }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">

        <Tooltip text={INFO[label]}>
            <div className="font-semibold text-gray-600">{label}</div>
        </Tooltip>

      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        autoFocus={autoFocus}
        className="w-full font-mono text-center bg-gray-50 rounded-lg py-2
                   outline-none border border-gray-200
                   transition-all duration-300 ease-in-out
                   focus:ring-2 focus:ring-teal-400
                   focus:ring-offset-1 focus:ring-offset-gray-100
                   focus:shadow-[0_0_12px_rgba(52,211,153,0.7)]
                   placeholder-gray-400"
        placeholder="Enter value"
      />

      <div className="text-right" dir="ltr">
        <Tooltip text={INFO[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}
function RowView({ label, value, unit }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">

        <Tooltip text={INFO[label]}>
            <div className="font-semibold text-gray-600">{label}</div>
        </Tooltip>

       <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200 ">
        {value}
      </div>

      <div className="text-right" dir="ltr">
        <Tooltip text={INFO[unit]}>
         <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}