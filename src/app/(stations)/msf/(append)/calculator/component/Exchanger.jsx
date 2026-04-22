"use client";

import Tooltip from "@/components/Tooltip";
import { Droplets, Info, Calculator, FlaskRound,FlaskConical, DollarSign ,Thermometer, AirVent, Flame} from "lucide-react";
import { useState, useRef } from "react";


import jsPDF from "jspdf";
import { toPng } from "html-to-image";


const INFO_13 = {
    "k":"Thermal conductivity",
    "h":"Heat transfer coefficient",
    "FF":"Fouling resistance",
    "Td":"Distillate temperature",
    "Tb":"Brine temperature",
    "Uc":"Condenser heat transfer coefficient",
    "Ue":"Evaporator heat transfer coefficient",
    "W/m.°C":"Watt per meter per degree Celsius",
    "MJ/m.h.°C":"Megajoule per meter per hour per degree Celsius",
    "W/m².°C":"Watt per square meter per degree Celsius",
    "MJ/m².h.°C":"Megajoule per square meter per hour per degree Celsius",
    "m².°C/W":"Square meter degree Celsius per watt",
    "m².h.°C/MJ":"Square meter hour degree Celsius per megajoule",
    "°C":"Celsius",
};

const INFO_14 = {
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
    "Th2":"Hot side outlet temperature",
    "m²":"Square meters",
    "MJ/h":"Megajoule per hour",
    "k":"Wall thermal conductivity k,Aluminum-brass: k≈ 0.432,Cu-Ni 90/10: k≈ 0.18,Cu-Ni 70/30: k≈ 0.108,Stainless steel: k≈ 0.055,Titanium: k≈ 0.055 MJ/m.h.°C"



};




  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };
  
  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };
// Thermal Conductivity &&  Heat Transfer Coefficient. &&  Fouling Factor && Temperatures
export function Thirteen() {

// Thermal Conductivity
const [k_w, setK_w] = useState(12000);     // W/m.°C
const [k_mj, setK_mj] = useState(7.2);   // MJ/m.h.°C

// Heat Transfer Coefficient
const [h_w, setH_w] = useState(7000);     // W/m².°C
const [h_mj, setH_mj] = useState(25.2);   // MJ/m².h.°C

// Fouling Factor
const [ff_w, setFf_w] = useState(0.001);   // m².°C/W
const [ff_mj, setFf_mj] = useState(0.2778); // m².h.°C/MJ

// Temperatures
const [td, setTd] = useState(70); // Distillate temperature
const [tb, setTb] = useState(70); // Brine temperature


return (
  <div className="max-w-4xl mx-auto w-full space-y-3">
    <div className="text-gray-300 px-4 font-semibold flex items-center gap-2">
         <Flame className="w-4 h-4" />
        <span className="text-base">
         Thermal Properties
        </span>
    </div>
{/* ===== Grid Cards ===== */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* ===== Table 1 ===== */}
  <Section title="Thermal Conductivity [W/m.°C]">
    <RowInput
      label="k"
      unit="W/m.°C"
      value={k_w}
      onChange={(e) => allowNumber(e.target.value, setK_w)}
      onBlur={() => formatOnBlur(k_w, setK_w)}
      info={INFO_13}
    />
    <RowView
      label="k"
      value={k_w === null ? "-" :((3600 * k_w) / 1e6).toFixed(4)}
      unit="MJ/m.h.°C"
      info={INFO_13}
    />
  </Section>
  {/* ===== Table 2 ===== */}
  <Section title="Thermal Conductivity [MJ/m.h.°C]">
    <RowInput
      label="k"
      unit="MJ/m.h.°C"
      value={k_mj}
      onChange={(e) => allowNumber(e.target.value, setK_mj)}
      onBlur={() => formatOnBlur(k_mj, setK_mj)}
      info={INFO_13}
    />
    <RowView
      label="k"
      value={((1e6 * k_mj) / 3600).toFixed(4)}
      unit="W/m.°C"
      info={INFO_13}
    />
  </Section>

  {/* ===== Table 3 ===== */}
  <Section title="Convective Heat Transfer Coeff. [W/m².°C]">
    <RowInput
      label="h"
      unit="W/m².°C"
      value={h_w}
      onChange={(e) => allowNumber(e.target.value, setH_w)}
      onBlur={() => formatOnBlur(h_w, setH_w)}
      info={INFO_13}
    />
    <RowView
      label="h"
      value={h_w === null ? "-" : ((3600 * h_w) / 1e6).toFixed(4)}
      unit="MJ/m².h.°C"
      info={INFO_13}
    />
  </Section>
  {/* ===== Table 4 ===== */}
  <Section title="Convective Heat Transfer Coeff. [MJ/m².h.°C]">
    <RowInput
      label="h"
      unit="MJ/m².h.°C"
      value={h_mj}
      onChange={(e) => allowNumber(e.target.value, setH_mj)}
      onBlur={() => formatOnBlur(h_mj, setH_mj)}
      info={INFO_13}
    />
    <RowView
      label="h"
      value={h_mj === null ? "-" : ((1e6 * h_mj) / 3600).toFixed(4)}
      unit="W/m².°C"
      info={INFO_13}
    />
  </Section>

   {/* ===== Table 5 ===== */}
  <Section title="Fouling Resistance [m².°C/W]">
    <RowInput
      label="FF"
      unit="m².°C/W"
      value={ff_w}
      onChange={(e) => allowNumber(e.target.value, setFf_w)}
      onBlur={() => formatOnBlur(ff_w, setFf_w)}
      info={INFO_13}
    />
    <RowView
      label="FF"
      value={((1e6 * ff_w) / 3600).toFixed(4)}
      unit="m².h.°C/MJ"
      info={INFO_13}
    />
  </Section>
  {/* ===== Table 6 ===== */}
  <Section title="Fouling Resistance [m².h.°C/MJ]">
    <RowInput
      label="FF"
      unit="m².h.°C/MJ"
      value={ff_mj}
      onChange={(e) => allowNumber(e.target.value, setFf_mj)}
      onBlur={() => formatOnBlur(ff_mj, setFf_mj)}
      info={INFO_13}
    />
    <RowView
      label="FF"
      value={ff_mj === null ? "-" : ((3600 * ff_mj) / 1e6).toFixed(4)}
      unit="m².°C/W"
      info={INFO_13}
    />
  </Section>
  </div>
    <div className="text-gray-300 px-4 font-semibold flex items-center gap-2">
         <Flame className="w-4 h-4" />
        <span className="text-base">
         Correlations
        </span>
    </div>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
   {/* ===== Table 7 ===== */}
  <Section title="Condenser Correlation">

    <RowInput
      label="Td"
      unit="°C"
      value={td}
      onChange={(e) => allowNumber(e.target.value, setTd)}
      onBlur={() => formatOnBlur(td, setTd)}
      info={INFO_13}
    />
    <RowView
      label="Uc"
      value={(5.76 + 0.00576 * td + 576e-6 * Math.pow(td, 2)).toFixed(4)}
      unit="MJ/m².h.°C"
      info={INFO_13}
    />
  </Section>

  {/* ===== Table 8 ===== */}
  <Section title="Evaporator Correlation">
    <RowInput
      label="Tb"
      unit="°C"
      value={tb}
      onChange={(e) => allowNumber(e.target.value, setTb)}
      onBlur={() => formatOnBlur(tb, setTb)}
      info={INFO_13}
    />
    <RowView
      label="Ue"
      value={(7.02 + 0.054 * tb - 828e-6 * Math.pow(tb, 2) + 864e-8 * Math.pow(tb, 3)).toFixed(4)}
      unit="MJ/m².h.°C"
      info={INFO_13}
    />
  </Section>

  </div>

  </div>
);

}

export function Fourteen() {
  const targetRef = useRef(null);
  const targetRef_2 = useRef(null);

// ===== Table 1 =====
const [Th1, setTh1] = useState(70);
const [Tc2, setTc2] = useState(25);

const Tmean = 0.5 * (Number(Th1) + Number(Tc2));
const Ux = 5.76 + 0.00576 * Tmean + 576e-6 * Math.pow(Tmean, 2);


// ===== Table 2 =====
const [NTU, setNTU] = useState(2.0);
const [Cr, setCr] = useState(0.8);


const Cr_num = Number(Cr);
const NTU_num = Number(NTU);

const effectiveness = Cr_num === 1
  ? NTU_num / (1 + NTU_num)
  : (1 - Math.exp(-NTU_num * (1 - Cr_num))) /
    (1 - Cr_num * Math.exp(-NTU_num * (1 - Cr_num)));


// ===== Table 3 =====
const [Th1_3, setTh1_3] = useState(70);
const [Th2, setTh2] = useState(35);
const [Tc1, setTc1] = useState(65);
const [Tc2_3, setTc2_3] = useState(32);
const [Q, setQ] = useState(700);
const [A, setA] = useState(25);
const [Ur, setUr] = useState(8.9856);

 // 🔹 Reset
  const resetToDefaults = () => {
    setTh1_3(70);
    setTh2(35);
    setTc1(65);
    setTc2_3(32);
    setQ(700);
    setA(25);
    setUr(8.9856);
  };

  const dT1 = Th1_3 - Tc1;
const dT2 = Th2 - Tc2_3;


  const lmtd =
  dT1 > 0 && dT2 > 0
    ? Math.abs(dT1 - dT2) < 0.001
      ? dT1
      : (dT1 - dT2) / Math.log(dT1 / dT2)
    : 0;

const Ut = A > 0 && lmtd > 0 ? Q / (A * lmtd) : 0;
const K = Ur > 0 ? Ut / Ur : 0;
  

const exportPDF = async () => {
  if (!targetRef?.current) return;

  const doc = new jsPDF();

  // 🔹 تحويل العنصر إلى صورة
  const dataUrl = await toPng(targetRef.current, {
    cacheBust: true,
    backgroundColor: "#ffffff",
  });

  const img = new Image();
  img.src = dataUrl;

  await new Promise((res) => (img.onload = res));

  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = doc.internal.pageSize.getHeight();

  const imgWidth = img.width;
  const imgHeight = img.height;

  // 🔹 حساب المقاس المناسب
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  // 🔹 توسيط الصورة
  const x = (pdfWidth - finalWidth) / 2;
  const y = (pdfHeight - finalHeight) / 2;

  doc.addImage(img, "PNG", x, y, finalWidth, finalHeight);

  // 🔹 حفظ
  doc.save("Heat_Transfer_Testing.pdf");
};


// ===== Table 4 =====
const [hi, setHi] = useState(44);
const [FFi, setFFi] = useState(0.01);
const [delta, setDelta] = useState(0.001);
const [k, setKval] = useState(0.432);
const [sigma, setSigma] = useState(1.087);
const [FFo, setFFo] = useState(0.01);
const [ho, setHo] = useState(12);
const [Ur2, setUr2] = useState(8.9856);




const resetToDefault_2 = () => {
    setHi(44);
    setFFi(0.01);
    setDelta(0.001);
    setKval(0.432);
    setSigma(1.087);
    setFFo(0.01);
    setHo(12);
    setUr2(8.9856);
};


const resistance =
  (hi > 0 ? 1 / hi : 0) +
  FFi +
  (k > 0 ? delta / k : 0) +
  sigma * FFo +
  (ho > 0 ? sigma / ho : 0);

const Uth = resistance > 0 ? 1 / resistance : 0;
const K2 = Ur2 > 0 ? Uth / Ur2 : 0;





const exportPDF_2 = async () => {
  if (!targetRef_2?.current) return;

  const doc = new jsPDF();

  // 🔹 تحويل العنصر إلى صورة
  const dataUrl = await toPng(targetRef_2.current, {
    cacheBust: true,
    backgroundColor: "#ffffff",
  });

  const img = new Image();
  img.src = dataUrl;

  await new Promise((res) => (img.onload = res));

  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = doc.internal.pageSize.getHeight();

  const imgWidth = img.width;
  const imgHeight = img.height;

  // 🔹 حساب المقاس المناسب
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  // 🔹 توسيط الصورة
  const x = (pdfWidth - finalWidth) / 2;
  const y = (pdfHeight - finalHeight) / 2;

  doc.addImage(img, "PNG", x, y, finalWidth, finalHeight);

  // 🔹 حفظ
  doc.save("Heat_Transfer_Theory.pdf");
};

return (
<div className="max-w-4xl mx-auto w-full space-y-3">

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* ===== Table 1 ===== */}
<Section title="Heat Exchanger Correlation">
  <RowInput label="Th1" unit="°C" value={Th1}
    onChange={(e)=>allowNumber(e.target.value,setTh1)}
    onBlur={()=>formatOnBlur(Th1,setTh1)}
    info={INFO_14} />

  <RowInput label="Tc2" unit="°C" value={Tc2}
    onChange={(e)=>allowNumber(e.target.value,setTc2)}
    onBlur={()=>formatOnBlur(Tc2,setTc2)} info={INFO_14}/>

  <RowView label="Ux" value={(Ux).toFixed(4)} unit="MJ/m².h.°C" info={INFO_14}/>
</Section>


{/* ===== Table 2 ===== */}
<Section title="Counterflow Heat Exchanger Effectiveness">
  <RowInput label="NTU" unit="#" value={NTU}
    onChange={(e)=>allowNumber(e.target.value,setNTU)}
    onBlur={()=>formatOnBlur(NTU,setNTU)} info={INFO_14}/>

  <RowInput label="Cr" unit="#" value={Cr}
    onChange={(e)=>allowNumber(e.target.value,setCr)}
    onBlur={()=>formatOnBlur(Cr,setCr)} info={INFO_14}/>

  <RowView label="ε" value={(effectiveness).toFixed(4)} unit="#" info={INFO_14}/>
</Section>


{/* ===== Table 3 ===== */}
<div ref={targetRef}>
<Section title="Heat Transfer Correction Factor K (By Testing)" >
  <RowInput label="Th1" unit="°C" value={Th1_3}
    onChange={(e)=>allowNumber(e.target.value,setTh1_3)}
    onBlur={()=>formatOnBlur(Th1_3,setTh1_3)} info={INFO_14}/>

  <RowInput label="Th2" unit="°C" value={Th2}
    onChange={(e)=>allowNumber(e.target.value,setTh2)}
    onBlur={()=>formatOnBlur(Th2,setTh2)} info={INFO_14}/>

  <RowInput label="Tc1" unit="°C" value={Tc1}
    onChange={(e)=>allowNumber(e.target.value,setTc1)}
    onBlur={()=>formatOnBlur(Tc1,setTc1)} info={INFO_14}/>

  <RowInput label="Tc2" unit="°C" value={Tc2_3}
    onChange={(e)=>allowNumber(e.target.value,setTc2_3)}
    onBlur={()=>formatOnBlur(Tc2_3,setTc2_3)} info={INFO_14}/>

  <RowInput label="Q" unit="MJ/h" value={Q}
    onChange={(e)=>allowNumber(e.target.value,setQ)}
    onBlur={()=>formatOnBlur(Q,setQ)} info={INFO_14}/>

  <RowInput label="A" unit="m²" value={A}
    onChange={(e)=>allowNumber(e.target.value,setA)}
    onBlur={()=>formatOnBlur(A,setA)} info={INFO_14}/>

  <RowInput label="Ucorr" unit="MJ/m².h.°C" value={Ur}
    onChange={(e)=>allowNumber(e.target.value,setUr)}
    onBlur={()=>formatOnBlur(Ur,setUr)} info={INFO_14}/>

  <RowView label="LMTD" value={(lmtd).toFixed(4)} unit="°C" info={INFO_14}/>
  <RowView label="U" value={(Ut).toFixed(4)} unit="MJ/m².h.°C" info={INFO_14}/>
  <RowView label="K" value={(K).toFixed(4)} unit="#" info={INFO_14}/>

<div className="flex justify-end gap-2 pt-2 no-print mt-5">
          <button
          onClick={exportPDF}
          className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded cursor-pointer"
        >
          PDF
        </button>
          <button
            onClick={resetToDefaults}
            className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded ml-auto cursor-pointer font-semibold flex items-center gap-2"
            title="Reset to defaults"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
</Section>

</div>


{/* ===== Table 4 ===== */}
<div ref={targetRef_2}>
<Section title="Heat Transfer Correction Factor K (By Theory)">
  <RowInput label="ho" unit="MJ/m².h.°C" value={ho}
    onChange={(e)=>allowNumber(e.target.value,setHo)}
    onBlur={()=>formatOnBlur(ho,setHo)} info={INFO_14}/>

  <RowInput label="FFo" unit="m².h.°C/MJ" value={FFo}
    onChange={(e)=>allowNumber(e.target.value,setFFo)}
    onBlur={()=>formatOnBlur(FFo,setFFo)} info={INFO_14}/>

  <RowInput label="δ" unit="m" value={delta}
    onChange={(e)=>allowNumber(e.target.value,setDelta)}
    onBlur={()=>formatOnBlur(delta,setDelta)} info={INFO_14}/>

  <RowInput label="k" unit="MJ/m.h.°C" value={k}
    onChange={(e)=>allowNumber(e.target.value,setKval)}
    onBlur={()=>formatOnBlur(k,setKval)} info={INFO_14}/>

  <RowInput label="σ" unit="#" value={sigma}
    onChange={(e)=>allowNumber(e.target.value,setSigma)}
    onBlur={()=>formatOnBlur(sigma,setSigma)} info={INFO_14}/>

  <RowInput label="FFi" unit="m².h.°C/MJ" value={FFi}
    onChange={(e)=>allowNumber(e.target.value,setFFi)}
    onBlur={()=>formatOnBlur(FFi,setFFi)} info={INFO_14}/>

  <RowInput label="hi" unit="MJ/m².h.°C" value={hi}
    onChange={(e)=>allowNumber(e.target.value,setHi)}
    onBlur={()=>formatOnBlur(hi,setHi)} info={INFO_14}/>

  <RowInput label="Ucorr" unit="MJ/m².h.°C" value={Ur2}
    onChange={(e)=>allowNumber(e.target.value,setUr2)}
    onBlur={()=>formatOnBlur(Ur2,setUr2)} info={INFO_14}/>

  <RowView label="U" value={(Uth).toFixed(4)} unit="MJ/m².h.°C" info={INFO_14}/>
  <RowView label="K" value={(K2).toFixed(4)} unit="#" info={INFO_14}/>

  <div className="flex justify-end gap-2 pt-2 no-print mt-5">
        <button
          onClick={exportPDF_2}
          className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded cursor-pointer"
        >
          PDF
        </button>

       <button
            onClick={resetToDefault_2}
            className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded ml-auto cursor-pointer font-semibold flex items-center gap-2"
            title="Reset to defaults"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset</span>
          </button>
      </div>

</Section>
</div>
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
         <Thermometer className="w-4 h-4" />
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
}function RowInput({ label, unit, value, onChange, onBlur, autoFocus, info }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">

      {info[label] ? (
        <Tooltip text={info[label]}>
          <div className="font-semibold text-[#4b5563] underline decoration-dashed underline-offset-5 cursor-help">
            {label}
          </div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-[#4b5563]">{label}</div>
      )}

      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        autoFocus={autoFocus}
        className="w-full font-mono text-center bg-[#f9fafb] rounded-lg py-2
                   outline-none border border-[#e5e7eb]
                   transition-all duration-300 ease-in-out
                   focus:ring-2 focus:ring-[#14b8a6]
                   focus:ring-offset-1 focus:ring-offset-[#f3f4f6]
                   focus:shadow-[0_0_12px_rgba(20,184,166,0.6)]
                   placeholder-[#9ca3af]"
        placeholder="Enter value"
      />

      <div className="text-right" dir="ltr">
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-[#4b5563] font-semibold underline decoration-dashed underline-offset-4">
            {unit}
          </span>
        </Tooltip>
      </div>
    </div>
  );
}


function RowView({ label, value, unit, info }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">

      {info[label] ? (
        <Tooltip text={info[label]}>
          <div className="font-semibold text-[#4b5563] underline decoration-dashed underline-offset-5 cursor-help">
            {label}
          </div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-[#4b5563]">{label}</div>
      )}

      <div className="text-center font-mono text-black bg-[#eff6ff] rounded-xl p-2 border border-[#e5e7eb]">
        {value}
      </div>

      <div className="text-right" dir="ltr">
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-[#4b5563] font-semibold underline decoration-dashed underline-offset-5">
            {unit}
          </span>
        </Tooltip>
      </div>

    </div>
  );
}