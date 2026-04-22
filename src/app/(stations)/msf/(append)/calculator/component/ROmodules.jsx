"use client";

import Tooltip from "@/components/Tooltip";
import { Beaker, Gauge, FlaskConical, Thermometer } from "lucide-react";
import { useState, useEffect, useRef ,useCallback} from "react";

import jsPDF from "jspdf";
import { toPng } from "html-to-image";

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
export default function ROModules({ count }) {
  const targetRef = useRef(null);

  const storageKey = `modules_${count}`;
const [customModules, setCustomModules] = useState(() => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  }
  return {};
});




function usePersistentState(key, defaultValue) {
  // 1. Lazy init (SSR safe)
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultValue;

      const parsed = JSON.parse(saved);

      if (parsed && typeof parsed === "object" && "last" in parsed) {
        return parsed.last;
      }

      return parsed ?? defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  // 2. Safe setter
  const setPersistentState = useCallback((value) => {
    setState((prev) => {
      const newValue =
        typeof value === "function" ? value(prev) : value;

      // 🔥 حماية من circular / DOM objects
      let safeValue = newValue;

      if (typeof newValue === "object" && newValue !== null) {
        try {
          safeValue = JSON.parse(JSON.stringify(newValue));
        } catch (e) {
          console.error("Invalid object for storage:", e);
          return prev;
        }
      }

      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            key,
            JSON.stringify({
              last: safeValue,
              updatedAt: Date.now(),
            })
          );
        }
      } catch (e) {
        console.error("localStorage write error:", e);
      }

      return safeValue;
    });
  }, [key]);

  // 3. Sync tabs (bonus)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(parsed?.last ?? defaultValue);
        } catch {}
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, defaultValue]);

  return [state, setPersistentState];
}

  const [Module, setModule] = usePersistentState(`${storageKey}.Module`, "SWRO Module");
  const [A, setA] = usePersistentState(`${storageKey}.A`, 40.9);
  const [Pf, setPf] = usePersistentState(`${storageKey}.Pf`, 55);
  const [Pb, setPb] = usePersistentState(`${storageKey}.Pb`, 0);
  const [Md, setMd] = usePersistentState(`${storageKey}.Md`, 1.2146);
  const [WR, setWR] = usePersistentState(`${storageKey}.WR`, 8);
  const [Sf, setSf] = usePersistentState(`${storageKey}.Sf`, 32);
  const [Tf, setTf] = usePersistentState(`${storageKey}.Tf`, 25);
  const [SR, setSR] = usePersistentState(`${storageKey}.SR`, 99.7);





useEffect(() => {
  localStorage.setItem(storageKey, JSON.stringify(customModules));
}, [customModules, storageKey]);

// ===== Modules =====
const allModules = {
  "SWRO Module": {
    A: 40.9,
    Pf: 55,
    Pb: 0,
    Md: 1.2146,
    WR: 8,
    Sf: 32,
    Tf: 25,
    SR: 99.7,
  },
  ...customModules,
};

// ===== Edit States =====
const [editMode, setEditMode] = useState(false);
const [editingModule, setEditingModule] = useState("");
const [newModuleName, setNewModuleName] = useState("");
const [isNewModule, setIsNewModule] = useState(false);
const [newModuleType, setNewModuleType] = useState(null);

// ===== Load Module عند الاختيار =====
useEffect(() => {
  const preset = allModules[Module];
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
}, [Module]);

// ===== Start Edit =====
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

// ===== Save Edit =====
const saveEditedModule = () => {
  const updatedData = { A, Pf, Pb, Md, WR, Sf, Tf, SR };

  if (editingModule === "SWRO Module") {
    // تحديث default module (اختياري)
    setCustomModules({
      ...customModules,
      ["SWRO Module"]: updatedData,
    });
  } else if (editingModule) {
    setCustomModules({
      ...customModules,
      [editingModule]: updatedData,
    });
  }

  setEditMode(false);
  setEditingModule("");
};

// ===== Cancel =====
const cancelEdit = () => {
  setEditMode(false);
  setEditingModule("");
  setIsNewModule(false);
  setNewModuleType(null);
  setNewModuleName("");

  // رجّع القيم للوحدة الحالية
  const preset = allModules[Module];
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

// ===== Add New Module =====
const handleAcceptNewModule = () => {
  if (newModuleName.trim() && !allModules[newModuleName.trim()]) {
    const newModuleData = { A, Pf, Pb, Md, WR, Sf, Tf, SR };

    setCustomModules({
      ...customModules,
      [newModuleName.trim()]: newModuleData,
    });

    setModule(newModuleName.trim());
    setNewModuleName("");
    setEditMode(false);
    setIsNewModule(false);
    setNewModuleType(null);
  }
};

// ===== Delete =====
const deleteModule = (mod) => {
  const updated = { ...customModules };
  delete updated[mod];

  setCustomModules(updated);

  if (Module === mod) {
    setModule("SWRO Module");
  }

  setEditMode(false);
  setEditingModule("");
};

// ===== Reset =====
const resetToDefaults = () => {
  setModule("SWRO Module");
  setA(40.9);
  setPf(55);
  setPb(0);
  setMd(1.2146);
  setWR(8);
  setSf(32);
  setTf(25);
  setSR(99.7);

  setEditMode(false);
  setEditingModule("");
};


const allowNumber = (value, setter) => {
  // يسمح فقط بالأرقام + نقطة + سالب
  if (/^-?\d*\.?\d*$/.test(value)) {
    // يمنع الحالات الخربانة مثل "." أو "-"
    if (value === "" || value === "-" || value === ".") {
      setter(value);
    } else {
      setter(parseFloat(value)); // ✅ نحول لرقم هنا
    }
  }
};;


  // Calculations
// تحويل كل القيم إلى أرقام
const nA = Number(A);
const nPf = Number(Pf);
const nPb = Number(Pb);
const nMd = Number(Md);
const nWR = Number(WR);
const nSf = Number(Sf);
const nTf = Number(Tf);
const nSR = Number(SR);

// Calculations
const Mf = (100 * nMd) / nWR;

const Sd = nSf * (1 - nSR / 100);

const Sb = (Mf * nSf - nMd * Sd) / (Mf - nMd);

// ✅ بدون exponent (أدق)
const dS = 0.5 * (nSf + Sb) - Sd;

// ✅ نفس معادلتك (تمام)
const dPi = 0.00255 * (273 + nTf) * dS;

// ✅ ΔP مصححة (بدون قسمة خطرة)
const dP =
  nPf -
  0.5 * (nPf - nPb) -
  0.5 * (0.0085 * Math.pow(Mf - 0.5 * nMd, 1.7)) -
  dPi;

// ✅ TCF القياسية (تعطي 1 عند 25°C)
const TCF = Math.exp(2640 * (1 / 298 - 1 / (273 + nTf)));

const w = (1e3 * nMd) / (nA * dP * TCF);

const x = (nMd * Sd * 1e3) / (nA * dS * TCF);

// ✅ PCF بدون hack
const PCF =
  1 +
  (
    (nPf - nPb) /
    (0.0085 * Math.pow(Mf - 0.5 * nMd, 1.7)) - 1
  ) *
  (nPb / (nPf || 1)); // حماية بسيطة



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
  doc.save("RO_Module_Parameters.pdf");
};


return (
  <div className="max-w-6xl w-full mx-auto mt-4">
    
    {/* Header */}
    <div className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-4 py-3 rounded-t-xl font-semibold">
      RO Module Parameters ({count})
    </div>

    <div className="bg-gray-50 p-4 rounded-b-xl shadow">



{/* Main Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  

  {/* LEFT (Inputs + Controls) */}
  <div className="space-y-4">

   <div className="space-y-2 pb-2 border-b border-gray-200">

  {/* ===== Module Select ===== */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <span className="text-sm sm:w-28">Module</span>

    <select
      value={Module === "SWRO Module" ? "__SWRO_DEFAULT__" : Module}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "__SWRO_DEFAULT__") {
          setModule("SWRO Module");

          // default values
          setA(40.9);
          setPf(55);
          setPb(0);
          setMd(1.2146);
          setWR(8);
          setSf(32);
          setTf(25);
          setSR(99.7);

        } else if (value) {
          const preset = customModules[value];
          if (preset) {
            setModule(value);
            setA(preset.A);
            setPf(preset.Pf);
            setPb(preset.Pb);
            setMd(preset.Md);
            setWR(preset.WR);
            setSf(preset.Sf);
            setTf(preset.Tf);
            setSR(preset.SR);
          }
        }
      }}
      className="flex-1 bg-gray-100 rounded px-2 py-1"
    >
      <option value="__SWRO_DEFAULT__">SWRO Module</option>
      {Object.keys(customModules).map((mod) => (
        <option key={mod} value={mod}>{mod}</option>
      ))}
    </select>
  </div>

  {/* ===== Edit Select ===== */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <span className="text-sm sm:w-28">Edit</span>

    <select
      value={editingModule}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "__NEW__") {
          setIsNewModule(true);
          setEditMode(true);
          setEditingModule("");
          setNewModuleName("");

        } else if (value === "__SWRO_DEFAULT__") {
          setIsNewModule(false);
          setEditingModule("SWRO Module");
          setEditMode(true);

        } else if (value) {
          setIsNewModule(false);
          startEditModule(value);
        }
      }}
      className="flex-1 bg-gray-100 rounded px-2 py-1"
    >
      <option value="">-- select --</option>
      <option value="__NEW__">New Module</option>
      <option value="__SWRO_DEFAULT__">SWRO Module</option>
      {Object.keys(customModules).map((mod) => (
        <option key={mod} value={mod}>{mod}</option>
      ))}
    </select>
  </div>

  {/* ===== Edit Mode ===== */}
  {editMode && (
    <div className="space-y-2">

      {/* New module input OR editing label */}
      {isNewModule ? (
        <input
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="New module name..."
          className="w-full bg-yellow-50 rounded px-2 py-1"
          autoFocus
        />
      ) : (
        <div className="text-sm bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded">
          Editing "<span className="font-semibold">{editingModule}</span>"
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2" ref={targetRef}>

        <button
          onClick={cancelEdit}
          className="bg-gray-400 text-white px-3 py-1 rounded w-full sm:w-auto"
        >
          Cancel
        </button>

        <button
          onClick={isNewModule ? handleAcceptNewModule : saveEditedModule}
          disabled={
            isNewModule &&
            (!newModuleName.trim() || customModules[newModuleName.trim()])
          }
          className="bg-green-500 text-white px-3 py-1 rounded w-full sm:w-auto disabled:opacity-40"
        >
          Accept
        </button>

        {!isNewModule && editingModule !== "SWRO Module" && (
          <button
            onClick={() => deleteModule(editingModule)}
            className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto"
          >
            Delete
          </button>
        )}

      </div>
    </div>
  )}

</div>

    {/* Inputs */}
<div className="space-y-2">
<RowInput
  label="A"
  unit="l/m².h.bar"
  value={A}
  onChange={(e) => allowNumber(e.target.value, setA)}
  
  info={INFO}
/>

<RowInput
  label="Pf"
  unit="bar"
  value={Pf}
  onChange={(e) => allowNumber(e.target.value, setPf)}
  info={INFO}
/>

<RowInput
  label="Pb"
  unit="bar"
  value={Pb}
  onChange={(e) => allowNumber(e.target.value, setPb)}
  info={INFO}
/>

<RowInput
  label="Md"
  unit="l/m².h"
  value={Md}
  onChange={(e) => allowNumber(e.target.value, setMd)}
  info={INFO}
/>

<RowInput
  label="WR"
  unit="%"
  value={WR}
  onChange={(e) => allowNumber(e.target.value, setWR)}
  info={INFO}
/>

<RowInput
  label="Sf"
  unit="g/l"
  value={Sf}
  onChange={(e) => allowNumber(e.target.value, setSf)}
  info={INFO}
/>

<RowInput
  label="Tf"
  unit="°C"
  value={Tf}
  onChange={(e) => allowNumber(e.target.value, setTf)}
  info={INFO}
/>

<RowInput
  label="SR"
  unit="%"
  value={SR}
  onChange={(e) => allowNumber(e.target.value, setSR)}
  info={INFO}
/>
</div>

  </div>

  {/* RIGHT (Outputs) */}
<div className="space-y-2">
  <RowView label="Mf" value={Mf.toFixed(4)} unit="l/m².h" info={INFO} />
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