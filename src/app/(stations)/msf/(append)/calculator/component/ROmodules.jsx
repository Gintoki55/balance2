"use client";

import Tooltip from "@/components/Tooltip";
import { Beaker, Gauge, FlaskConical, Thermometer } from "lucide-react";
import { useState, useEffect } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const INFO = {
  A: "Membrane area",
  Pf: "Feed pressure",
  Pb: "Brine pressure as given by test",
  Md: "Product flow rate",
  WR: "Water recovery",
  Sf: "Feed salinity",
  Tf: "Feed temperature",
  SR: "Average salt rejection, e.g. for 99.8% (99.6% minimum) average is 99.7%",
  Mf: "Feed flow per element",
  Sd: "Product salinity",
  Sb: "Brine salinity",
  ΔS: "Mean membrane wall salinity",
  Δπ: "Mean osmotic pressure",
  "∆P": "Net driving pressure",
  TCF: "Temperature correction factor",
  w: "Water permeability coefficient",
  x: "Salt permeability coefficient",
  PCF: "Pressure correction factor",
  "M²": "square meters",
  bar: "bar",
  "t/h": "Tonnes per hour",
  "%": "percent",
  "°C": "celsius",
  "g/l": "gram per liter",
  "#": "dimensionless",
  "l/m².h.bar": "liter per square meter per hour per bar",
  "g/m².h.(g/l)": "Grams per square meter per hour per g/l",
};
export default function ROModules() {

  const [A, setA] = useState(40.9);
  const [Pf, setPf] = useState(55);
  const [Pb, setPb] = useState(54.192);
  const [Md, setMd] = useState(1.2146);
  const [WR, setWR] = useState(8);
  const [Sf, setSf] = useState(32);
  const [Tf, setTf] = useState(25);
  const [SR, setSR] = useState(99.7);



    const [customModules, setCustomModules] = useState(() => {
    if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("modules") || "{}");
    }
    return {};
    });
    const [Module, setModule] = useState("");
    const [newModuleName, setNewModuleName] = useState("");
    const [editingModule, setEditingModule] = useState("");
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
  localStorage.setItem("modules", JSON.stringify(customModules));
}, [customModules]);

    const allModules = customModules || {};

    const handleAddModule = () => {
        if (newModuleName.trim() && !allModules[newModuleName.trim()]) {
            const newData = { A, Pf, Pb, Md, WR, Sf, Tf, SR };
            setCustomModules({ ...customModules, [newModuleName.trim()]: newData });
            setModule(newModuleName.trim());
            setNewModuleName("");
        }
    };

    const startEditModule = (mod) => {
        setEditingModule(mod);
        setEditMode(true);

        const preset = allModules[mod];
        if (preset) {
            setA(preset.A);
            setPf(preset.Pf);
            setPb(preset.Pb);
            setMd(preset.Md);
            setWR(preset.WR);
            setSf(preset.Sf);
            setTf(preset.Tf);
            setSR(preset.SR);
        }
    };

const saveEditedModule = () => {
  if (editingModule) {
    const updated = { A, Pf, Pb, Md, WR, Sf, Tf, SR };
    setCustomModules({ ...customModules, [editingModule]: updated });
  }
  setEditMode(false);
  setEditingModule("");
};

const cancelEdit = () => {
  setEditMode(false);
  setEditingModule("");
};

const deleteModule = (mod) => {
  const updated = { ...customModules };
  delete updated[mod];
  setCustomModules(updated);
  setEditMode(false);
  setEditingModule("");
};


  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };
  
  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };


  /* ===== Calculations ===== */

  const Mf = (100 * Number(Md)) / Number(WR);
  const Sd = Number(Sf) * (1 - Number(SR) / 100);
  const Sb = (Mf * Number(Sf) - Number(Md) * Sd) / (Mf - Number(Md));

  const dS =
    (0.5 * (Number(Sf) + Sb) - Sd) *
    Math.exp(0.7 * (Number(Md) / Mf));

  const dPi = 0.00255 * 298 * dS;
  const dP = 0.5 * (Number(Pf) + Number(Pb)) - dPi;

  const TCF =
    0.33 + 0.0247 * Number(Tf) + 0.00000336 * Math.pow(Number(Tf), 3);

  const w = (Number(Md) * 1000) / (Number(A) * dP * TCF);
  const x = (Number(Md) * Sd * 1000) / (Number(A) * dS * TCF);

  const PCF =
    (Number(Pf) - Number(Pb)) /
    (0.0085 * Math.pow(Mf - 0.5 * Number(Md), 1.7));
    const Pb_corr = Pf - 0.0085 * Math.pow(Mf - 0.5 * Md, 1.7); // Correlated brine pressure



   // 🔹 Reset
  const resetToDefaults = () => {
    setA(40.9);
    setPf(55);
    setPb(54.192);
    setMd(1.2146);
    setWR(8);
    setSf(32);
    setTf(25);
    setSR(99.7);
  };


  const inputData = [
  { symbol: "Inputs", value: "", unit: "" },
   { symbol: "A", value: A, unit: "M²" },
  { symbol: "Pf", value: Pf, unit: "bar" },
  { symbol: "Pb", value: Pb, unit: "bar" },
  { symbol: "Md", value: Md, unit: "t/h" },
  { symbol: "WR", value: WR, unit: "%" },
  { symbol: "Sf", value: Sf, unit: "g/l" },
  { symbol: "Tf", value: Tf, unit: "°C" },
  { symbol: "SR", value: SR, unit: "%" },
];



const outputData = [
  { symbol: "Outputs", value: "", unit: "" },
  { symbol: "Mf", value: Mf, unit: "t/h" },
  { symbol: "Pb", value: Pb_corr, unit: "bar" },
  { symbol: "Sd", value: Sd, unit: "g/l" },
  { symbol: "Sb", value: Sb, unit: "g/l" },
  { symbol: "ΔS", value: dS, unit: "g/l" },
  { symbol: "Δπ", value: dPi, unit: "bar" },
  { symbol: "ΔP", value: dP, unit: "bar" },
  { symbol: "TCF", value: TCF, unit: "#" },
  { symbol: "w", value: w, unit: "l/m².h.bar" },
  { symbol: "x", value: x, unit: "g/m².h.(g/l)" },
  { symbol: "PCF", value: PCF, unit: "#" },
];

// 🔹 PDF
const exportPDF = () => {
  const doc = new jsPDF();

  // 🔹 عنوان
  doc.setFontSize(16);
  doc.text("RO Module Parameters", 10, 15);

  // 🔹 دالة تنسيق الأرقام
  const formatValue = (val) => {
    if (val === "" || val === null || val === undefined) return "";
    if (typeof val === "number") return val.toFixed(4);
    return val;
  };

  // ===== Inputs =====
  const inputRows = inputData
    .filter(row => row.symbol !== "Inputs") // نشيل العنوان
    .map(row => [
      row.symbol,
      formatValue(row.value),
      row.unit
    ]);

  doc.setFontSize(12);
  doc.text("Inputs", 10, 25);

  autoTable(doc, {
    startY: 30,
    head: [["Symbol", "Value", "Unit"]],
    body: inputRows,
  });

  // ===== Outputs =====
  const outputRows = outputData
    .filter(row => row.symbol !== "Outputs")
    .map(row => [
      row.symbol,
      formatValue(row.value),
      row.unit
    ]);

  doc.text("Outputs", 10, doc.lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Symbol", "Value", "Unit"]],
    body: outputRows,
  });

  // 🔹 حفظ
  doc.save("RO_Module_Parameters.pdf");
};

// 🔹 Excel
const exportExcel = () => {
  const wb = XLSX.utils.book_new();

  // 🟢 Sheet 1 (Inputs)
  const wsInputs = XLSX.utils.json_to_sheet(inputData);

  // ✅ هنا تحطها
  wsInputs["!cols"] = [
    { wch: 10 }, // symbol
    { wch: 15 }, // value
    { wch: 15 }, // unit
  ];

  XLSX.utils.book_append_sheet(wb, wsInputs, "Inputs");

  // 🔵 Sheet 2 (Outputs)
  const wsOutputs = XLSX.utils.json_to_sheet(outputData);

  // ✅ وهنا أيضاً
  wsOutputs["!cols"] = [
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, wsOutputs, "Outputs");

  // 💾 حفظ الملف
  XLSX.writeFile(wb, "RO_Module_Parameters.xlsx");
};


return (
  <div className="max-w-6xl w-full mx-auto mt-4">
    
    {/* Header */}
    <div className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-4 py-3 rounded-t-xl font-semibold">
      RO Module Parameters
    </div>

    <div className="bg-gray-50 p-4 rounded-b-xl shadow">



{/* Main Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* LEFT (Inputs + Controls) */}
  <div className="space-y-4">

    {/* Controls (stacked) */}
    <div className="space-y-2">

      {/* Open */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-sm sm:w-28">Open Module</span>
        <select
          value={Module}
          onChange={(e) => {
            const mod = e.target.value;
            setModule(mod);

            const preset = allModules[mod];
            if (preset) {
              setA(preset.A);
              setPf(preset.Pf);
              setPb(preset.Pb);
              setMd(preset.Md);
              setWR(preset.WR);
              setSf(preset.Sf);
              setTf(preset.Tf);
              setSR(preset.SR);
            }
          }}
          className="flex-1 bg-gray-100 rounded px-2 py-1"
        >
          <option value="">-- select --</option>
          {Object.keys(allModules || {}).map((mod) => (
            <option key={mod}>{mod}</option>
          ))}
        </select>
      </div>

      {/* Add */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-sm sm:w-28">Add Module</span>
        <input
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="New module name..."
          className="flex-1 bg-yellow-50 rounded px-2 py-1"
        />
        <button onClick={handleAddModule} disabled={!newModuleName.trim()} className="bg-blue-400 text-white px-3 py-1 rounded w-full sm:w-auto disabled:opacity-50">
          Save
        </button>
      </div>

      {/* Edit */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-sm sm:w-28">Edit Module</span>
        <select
          value={editingModule}
          onChange={(e) => startEditModule(e.target.value)}
          className="flex-1 bg-gray-100 rounded px-2 py-1"
        >
          <option value="">-- select --</option>
          {Object.keys(customModules || {}).map((mod) => (
            <option key={mod}>{mod}</option>
          ))}
        </select>
      </div>

      {/* Edit Mode */}
           {editMode && (
  <div className="space-y-2">

    {/* Message */}
    <div className="text-sm bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded">
      Editing "<span className="font-semibold">{editingModule}</span>" — change values below, then Accept or Cancel
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-2">
      
      <button
        onClick={saveEditedModule}
        className="bg-green-500 text-white px-3 py-1 rounded w-full sm:w-auto"
      >
        Accept
      </button>

      <button
        onClick={cancelEdit}
        className="bg-gray-400 text-white px-3 py-1 rounded w-full sm:w-auto"
      >
        Cancel
      </button>

      <button
        onClick={() => deleteModule(editingModule)}
        className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto"
      >
        Delete
      </button>

    </div>

  </div>
)}
    </div>

    {/* Inputs */}
<div className="space-y-2">
  <RowInput label="A" unit="M²" value={A} onChange={(e)=>allowNumber(e.target.value,setA)} info={INFO} />
  <RowInput label="Pf" unit="bar" value={Pf} onChange={(e)=>allowNumber(e.target.value,setPf)} info={INFO} />
  <RowInput label="Pb" unit="bar" value={Pb} onChange={(e)=>allowNumber(e.target.value,setPb)} info={INFO} />
  <RowInput label="Md" unit="t/h" value={Md} onChange={(e)=>allowNumber(e.target.value,setMd)} info={INFO} />
  <RowInput label="WR" unit="%" value={WR} onChange={(e)=>allowNumber(e.target.value,setWR)} info={INFO} />
  <RowInput label="Sf" unit="g/l" value={Sf} onChange={(e)=>allowNumber(e.target.value,setSf)} info={INFO} />
  <RowInput label="Tf" unit="°C" value={Tf} onChange={(e)=>allowNumber(e.target.value,setTf)} info={INFO} />
  <RowInput label="SR" unit="%" value={SR} onChange={(e)=>allowNumber(e.target.value,setSR)} info={INFO} />
</div>

  </div>

  {/* RIGHT (Outputs) */}
<div className="space-y-2">
  <RowView label="Mf" value={Mf.toFixed(4)} unit="t/h" info={INFO} />
  <RowView label="Pb" value={Pb_corr.toFixed(4)} unit="bar" info={INFO} />
  <RowView label="Sd" value={Sd.toFixed(4)} unit="g/l" info={INFO} />
  <RowView label="Sb" value={Sb.toFixed(4)} unit="g/l" info={INFO} />
  <RowView label="ΔS" value={dS.toFixed(4)} unit="g/l" info={INFO} />
  <RowView label="Δπ" value={dPi.toFixed(4)} unit="bar" info={INFO} />
  <RowView label="∆P" value={dP.toFixed(4)} unit="bar" info={INFO} />
  <RowView label="TCF" value={TCF.toFixed(4)} unit="#" info={INFO} />
  <RowView label="w" value={w.toFixed(4)} unit="l/m².h.bar" info={INFO} />
  <RowView label="x" value={x.toFixed(4)} unit="g/m².h.(g/l)" info={INFO} />
  <RowView label="PCF" value={PCF.toFixed(4)} unit="#" info={INFO} />
</div>

</div>

      {/* Footer Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={exportPDF}
          className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded cursor-pointer"
        >
          PDF
        </button>

        <button
          onClick={exportExcel}
          className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded cursor-pointer"
        >
          Excel
        </button>

        <button
          onClick={resetToDefaults}
          className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded ml-auto cursor-pointer"
        >
          ↺ Reset
        </button>
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
}
function RowInput({ label, unit, value, onChange, onBlur, autoFocus,info }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">
      {info[label] ? (
        <Tooltip text={info[label]}>
         <div className="font-semibold text-gray-600 underline decoration-dashed underline-offset-5 cursor-help">{label}</div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-gray-600">{label}</div>
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
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-4">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}
function RowView({ label, value, unit , info}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-l">

      {info[label] ? (
        <Tooltip text={info[label]}>
          <div className="font-semibold text-gray-600 underline decoration-dashed underline-offset-5 cursor-help">{label}</div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-gray-600">{label}</div>
      )}

      <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200">
        {value}
      </div>

      <div className="text-right" dir="ltr">
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">{unit}</span>
        </Tooltip>
      </div>

    </div>
  );
}