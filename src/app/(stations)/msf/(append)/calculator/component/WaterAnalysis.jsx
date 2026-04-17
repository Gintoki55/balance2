
"use client";

import Tooltip from "@/components/Tooltip";
import {
  Beaker,
  Gauge,
  FlaskConical,
  Thermometer,
  DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const INFO= {
    Na: "Sodium ion, major cation in seawater and brackish water",
    K: "Potassium ion, essential nutrient found in most water sources",
    Ca: "Calcium ion, primary contributor to water hardness",
    Mg: "Magnesium ion, secondary contributor to water hardness",
    Ba: "Barium ion, causes scaling (BaSO\u2084) in RO systems",
    Sr: "Strontium ion, causes scaling (SrSO\u2084) in RO concentrate",
    Fe: "Iron ion, causes fouling and staining in water systems",
    Li: "Lithium ion, found in geothermal and brine waters",
    NH4: "Ammonium ion, indicator of organic contamination or wastewater",
    Mn: "Manganese ion, common in groundwater, causes staining",
    Al: "Aluminum ion, found in acidic waters and after coagulation",
    Zn: "Zinc ion, from corrosion of galvanized pipes or industrial discharge",
    Cu: "Copper ion, from pipe corrosion or industrial sources",
    Pb: "Lead ion, from old pipes and solder, toxic heavy metal",
    Ni: "Nickel ion, from industrial discharge or stainless steel corrosion",
    Cr: "Chromium ion, from industrial discharge, regulated contaminant",
    Cl: "Chloride ion, major anion in seawater and brackish water",
    SO4: "Sulfate ion, causes scaling (CaSO\u2084) in RO systems",
    HCO3: "Bicarbonate ion, primary component of alkalinity",
    CO3: "Carbonate ion, present at high pH, contributes to alkalinity and scaling",
    NO3: "Nitrate ion, from agricultural runoff and wastewater",
    F: "Fluoride ion, naturally occurring, regulated in drinking water",
    NO2: "Nitrite ion, intermediate in nitrogen cycle, indicator of contamination",
    PO4: "Phosphate ion, from detergents, agriculture, and wastewater",
    Br: "Bromide ion, found in seawater, forms disinfection byproducts",
    I: "Iodide ion, found in brine and some groundwater sources",
    HS: "Hydrogen sulfide ion, causes odor and corrosion, from anaerobic conditions",
    OH: "Hydroxide ion, present at high pH, contributes to alkalinity",
    SiO2: "Silica, causes colloidal fouling and scaling in RO membranes",
    B: "Boron, difficult to reject by RO membranes, regulated in irrigation water",
    CO2: "Dissolved carbon dioxide, affects pH and carbonate equilibrium",
  };

  const fmt = (v) => {
  if (!Number.isFinite(v)) return "-";
  if (v === 0) return "0.0000";
  const abs = Math.abs(v);
  if (abs < 1e-4 || abs >= 1e6) return v.toExponential(4);
  return v.toFixed(4);
}; 
// ─── Safe Persistent State Hook ───────────────────────────────
function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed?.last ?? defaultValue);
      }
    } catch (e) {
      console.error("localStorage read error:", e);
    }
  }, [key, defaultValue]);

  const setPersistentState = (value) => {
    setState(value);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ default: defaultValue, last: value }),
        );
      } catch (e) {
        console.error("localStorage write error:", e);
      }
    }
  };

  return [state, setPersistentState, isMounted];
}



const defaultIons = {
  // Cations - Arabian Sea typical values at 40 g/L salinity
  Na: 12300, K: 450, Ca: 460, Mg: 1470, Ba: 0, Sr: 9, Fe: 0,
  Li: 0, NH4: 0, Mn: 0, Al: 0, Zn: 0, Cu: 0, Pb: 0, Ni: 0, Cr: 0,
  // Anions
  Cl: 22200, SO4: 3100, HCO3: 160, CO3: 0, NO3: 0, F: 1.5,
  NO2: 0, PO4: 0, Br: 77, I: 0, HS: 0, OH: 0,
  // Neutral
  SiO2: 1, B: 5.0, CO2: 0,
};

// Water source presets (mg/l concentrations at reference salinity)
const waterSourcePresets = {
  openSea: {
    refSalinity: 40, // g/L - Arabian Sea typical salinity
    ions: {
      Na: 12300, K: 450, Ca: 460, Mg: 1470, Ba: 0, Sr: 9, Fe: 0,
      Li: 0, NH4: 0, Mn: 0, Al: 0, Zn: 0, Cu: 0, Pb: 0, Ni: 0, Cr: 0,
      Cl: 22200, SO4: 3100, HCO3: 160, CO3: 0, NO3: 0, F: 1.5,
      NO2: 0, PO4: 0, Br: 77, I: 0, HS: 0, OH: 0,
      SiO2: 1, B: 5.0, CO2: 0,
    },
    pH: 8.1, T: 30,
    // Pretreatment test typical values for Arabian Sea open water
    turbidity: 2, sdi: 2, tss: 5, cod: 5, bod: 2, totalBacteria: 500, coliform: 5,
  },
  beachWell: {
    refSalinity: 35, // g/L - Arabian Sea beach well typical salinity
    ions: {
      Na: 10800, K: 400, Ca: 420, Mg: 1300, Ba: 0.1, Sr: 8, Fe: 0.05,
      Li: 0, NH4: 0.5, Mn: 0.02, Al: 0, Zn: 0.01, Cu: 0.01, Pb: 0, Ni: 0, Cr: 0,
      Cl: 19500, SO4: 2800, HCO3: 180, CO3: 0, NO3: 2, F: 1.3,
      NO2: 0.1, PO4: 0.1, Br: 68, I: 0.05, HS: 0, OH: 0,
      SiO2: 5, B: 4.5, CO2: 10,
    },
    pH: 7.8, T: 28,
    // Pretreatment test typical values for beach well (filtered by sand)
    turbidity: 1, sdi: 1.5, tss: 2, cod: 8, bod: 3, totalBacteria: 200, coliform: 2,
  },
  brackishWater: {
    refSalinity: 5, // g/L - Arabian Sea brackish water typical salinity
    ions: {
      Na: 1550, K: 55, Ca: 180, Mg: 160, Ba: 0.5, Sr: 2, Fe: 0.2,
      Li: 0, NH4: 0.2, Mn: 0.05, Al: 0, Zn: 0.02, Cu: 0.01, Pb: 0, Ni: 0, Cr: 0,
      Cl: 2800, SO4: 600, HCO3: 350, CO3: 0, NO3: 5, F: 1.0,
      NO2: 0.05, PO4: 0.2, Br: 10, I: 0.02, HS: 0, OH: 0,
      SiO2: 15, B: 1.0, CO2: 20,
    },
    pH: 7.5, T: 27,
    // Pretreatment test typical values for brackish water (higher organic content)
    turbidity: 8, sdi: 4, tss: 15, cod: 20, bod: 8, totalBacteria: 2000, coliform: 20,
  },
};


  // Equivalent weights (molar mass / valence)
  const EW = {
    Na: 22.990, K: 39.098, Ca: 20.039, Mg: 12.153, Ba: 68.664, Sr: 43.810, Fe: 27.923,
    Li: 6.941, NH4: 18.039, Mn: 27.470, Al: 8.994, Zn: 32.685, Cu: 31.773, Pb: 103.600, Ni: 29.345, Cr: 17.332,
    Cl: 35.453, SO4: 48.030, HCO3: 61.016, CO3: 30.004, NO3: 62.004, F: 18.998,
    NO2: 46.006, PO4: 31.656, Br: 79.904, I: 126.904, HS: 33.073, OH: 17.008,
  };

  const cationKeys = ["Na", "K", "Ca", "Mg", "Ba", "Sr", "Fe", "Li", "NH4", "Mn", "Al", "Zn", "Cu", "Pb", "Ni", "Cr"];
  const anionKeys = ["Cl", "SO4", "HCO3", "CO3", "NO3", "F", "NO2", "PO4", "Br", "I", "HS", "OH"];
  const neutralKeys = ["SiO2", "B", "CO2"];

  const cationSymbols = {
    Na: "Na\u207A", K: "K\u207A", Ca: "Ca\u00B2\u207A", Mg: "Mg\u00B2\u207A", Ba: "Ba\u00B2\u207A", Sr: "Sr\u00B2\u207A", Fe: "Fe\u00B2\u207A",
    Li: "Li\u207A", NH4: "NH\u2084\u207A", Mn: "Mn\u00B2\u207A", Al: "Al\u00B3\u207A", Zn: "Zn\u00B2\u207A", Cu: "Cu\u00B2\u207A", Pb: "Pb\u00B2\u207A", Ni: "Ni\u00B2\u207A", Cr: "Cr\u00B3\u207A",
  };
  const anionSymbols = {
    Cl: "Cl\u207B", SO4: "SO\u2084\u00B2\u207B", HCO3: "HCO\u2083\u207B", CO3: "CO\u2083\u00B2\u207B", NO3: "NO\u2083\u207B", F: "F\u207B",
    NO2: "NO\u2082\u207B", PO4: "PO\u2084\u00B3\u207B", Br: "Br\u207B", I: "I\u207B", HS: "HS\u207B", OH: "OH\u207B",
  };
  const neutralSymbols = { SiO2: "SiO\u2082", B: "B", CO2: "CO\u2082" };


export default function WaterAnalysis() {
  const [ions, setIons] = usePersistentState("waterAnalysis.ions", defaultIons);
  const [pH, setPH] = usePersistentState("waterAnalysis.pH", 8.1);
  const [balanceMode, setBalanceMode] = usePersistentState("waterAnalysis.balanceMode", "none");
  const [waterSource, setWaterSource] = usePersistentState("waterAnalysis.waterSource", "openSea");
  const [S0, setS0] = usePersistentState("waterAnalysis.S0", 40);

  const getDefaultT = () => waterSource !== "custom" ? waterSourcePresets[waterSource].T : 25;
  const [T, setT] = usePersistentState("waterAnalysis.T", getDefaultT());

  const getDefaultPretreatment = () => waterSource !== "custom" ? waterSourcePresets[waterSource] : waterSourcePresets.openSea;
  const [turbidity, setTurbidity] = usePersistentState("waterAnalysis.turbidity", getDefaultPretreatment().turbidity);
  const [sdi, setSdi] = usePersistentState("waterAnalysis.sdi", getDefaultPretreatment().sdi);
  const [tss, setTss] = usePersistentState("waterAnalysis.tss", getDefaultPretreatment().tss);
  const [cod, setCod] = usePersistentState("waterAnalysis.cod", getDefaultPretreatment().cod);
  const [bod, setBod] = usePersistentState("waterAnalysis.bod", getDefaultPretreatment().bod);
  const [totalBacteria, setTotalBacteria] = usePersistentState("waterAnalysis.totalBacteria", getDefaultPretreatment().totalBacteria);
  const [coliform, setColiform] = usePersistentState("waterAnalysis.coliform", getDefaultPretreatment().coliform);

  const [isMaintenance, setIsMaintenance] = useState(true);

  const setIon = (key, val) => setIons(prev => ({ ...prev, [key]: val }));

  const applyWaterSourcePreset = (source, salinity) => {
    const preset = waterSourcePresets[source];
    if (!preset) return;

    const scaleFactor = salinity / preset.refSalinity;
    const scaledIons = { ...preset.ions };

    Object.keys(scaledIons).forEach(key => {
      scaledIons[key] = scaledIons[key] * scaleFactor;
    });

    setIons(scaledIons);
    setPH(preset.pH);
    setT(preset.T);
    setS0(salinity);

    setTurbidity(preset.turbidity);
    setSdi(preset.sdi);
    setTss(preset.tss);
    setCod(preset.cod);
    setBod(preset.bod);
    setTotalBacteria(preset.totalBacteria);
    setColiform(preset.coliform);
  };

  const resetToDefaults = () => {
    setIons(defaultIons);
    setPH(8.1);
    setBalanceMode("none");
    setWaterSource("openSea");
    setS0(40);
    setT(waterSourcePresets.openSea.T);

    setTurbidity(waterSourcePresets.openSea.turbidity);
    setSdi(waterSourcePresets.openSea.sdi);
    setTss(waterSourcePresets.openSea.tss);
    setCod(waterSourcePresets.openSea.cod);
    setBod(waterSourcePresets.openSea.bod);
    setTotalBacteria(waterSourcePresets.openSea.totalBacteria);
    setColiform(waterSourcePresets.openSea.coliform);
  };

  const EW = {
    Na: 22.990, K: 39.098, Ca: 20.039, Mg: 12.153, Ba: 68.664, Sr: 43.810, Fe: 27.923,
    Li: 6.941, NH4: 18.039, Mn: 27.470, Al: 8.994, Zn: 32.685, Cu: 31.773, Pb: 103.600, Ni: 29.345, Cr: 17.332,
    Cl: 35.453, SO4: 48.030, HCO3: 61.016, CO3: 30.004, NO3: 62.004, F: 18.998,
    NO2: 46.006, PO4: 31.656, Br: 79.904, I: 126.904, HS: 33.073, OH: 17.008,
  };

  const cationKeys = ["Na","K","Ca","Mg","Ba","Sr","Fe","Li","NH4","Mn","Al","Zn","Cu","Pb","Ni","Cr"];
  const anionKeys = ["Cl","SO4","HCO3","CO3","NO3","F","NO2","PO4","Br","I","HS","OH"];
  const neutralKeys = ["SiO2","B","CO2"];

  const meq = key => ions[key] / EW[key];

  const rawCatTotal = cationKeys.reduce((s,k)=>s+meq(k),0);
  const rawAnTotal = anionKeys.reduce((s,k)=>s+meq(k),0);

  let usedNa = ions.Na;
  let usedCl = ions.Cl;

  if (balanceMode === "adjustNa") {
    const otherCatMeq = rawCatTotal - meq("Na");
    const adjustedNaMeq = rawAnTotal - otherCatMeq;
    usedNa = Math.max(0, adjustedNaMeq * EW.Na);
  } else if (balanceMode === "adjustCl") {
    const otherAnMeq = rawAnTotal - meq("Cl");
    const adjustedClMeq = rawCatTotal - otherAnMeq;
    usedCl = Math.max(0, adjustedClMeq * EW.Cl);
  }

  const getMeq = key => {
    if (key === "Na" && balanceMode === "adjustNa") return usedNa / EW.Na;
    if (key === "Cl" && balanceMode === "adjustCl") return usedCl / EW.Cl;
    return meq(key);
  };

  const getMg = key => {
    if (key === "Na" && balanceMode === "adjustNa") return usedNa;
    if (key === "Cl" && balanceMode === "adjustCl") return usedCl;
    return ions[key];
  };

  const totalCat = cationKeys.reduce((s,k)=>s+getMeq(k),0);
  const totalAn = anionKeys.reduce((s,k)=>s+getMeq(k),0);

  const neutralTotal = neutralKeys.reduce((s,k)=>s+ions[k],0);
  const tds = cationKeys.reduce((s,k)=>s+getMg(k),0) + anionKeys.reduce((s,k)=>s+getMg(k),0) + neutralTotal;

  const balanceErr = (totalCat + totalAn) > 0 ? ((totalCat - totalAn) / (totalCat + totalAn)) * 100 : 0;
  const absErr = Math.abs(balanceErr);

  const hardnessCaCO3 = (getMeq("Ca") + getMeq("Mg")) * 50.043;
  const alkCaCO3 = (getMeq("HCO3") + getMeq("CO3") + getMeq("OH")) * 50.043;
  const ionicStr = 2.5e-5 * tds;

  const lsiA = (Math.log10(Math.max(tds, 1)) - 1) / 10;
  const lsiB = -13.12 * Math.log10(T + 273) + 34.55;
  const caCaCO3 = getMeq("Ca") * 50.043;
  const lsiC = Math.log10(Math.max(caCaCO3, 1)) - 0.4;
  const lsiD = Math.log10(Math.max(alkCaCO3, 1));
  const pHs = (9.3 + lsiA + lsiB) - (lsiC + lsiD);
  const lsi = pH - pHs;

  const isBalanced = (key) =>
  (key === "Na" && balanceMode === "adjustNa") ||
  (key === "Cl" && balanceMode === "adjustCl");

const renderIonRow = (key, symbol) => (
  <tr key={key}>
    <td><Tooltip content={INFO[key] || key}>{symbol}</Tooltip></td>
    <td>
      {isBalanced(key) ? (
        <span className="wa-output-cell block">{fmt(getMg(key))}</span>
      ) : (
        <input
          type="number"
          className="wa-input-cell"
          value={fmt(ions[key])}
          onChange={e => setIon(key, parseFloat(e.target.value) || 0)}
          step={0.0001}
        />
      )}
    </td>
    <td><span className="wa-output-cell block">{fmt(getMeq(key))}</span></td>
  </tr>
);

const renderNeutralRow = (key, symbol) => (
  <tr key={key}>
    <td><Tooltip content={INFO[key] || key}>{symbol}</Tooltip></td>
    <td>
      <input
        type="number"
        className="wa-input-cell"
        value={fmt(ions[key])}
        onChange={e => setIon(key, parseFloat(e.target.value) || 0)}
        step={0.0001}
      />
    </td>
    <td><span className="wa-output-cell block text-muted-foreground">—</span></td>
  </tr>
);

return (
  <div className="bg-gray-100 rounded-2xl shadow-sm overflow-hidden">
    {isMaintenance && (
    <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold py-2 rounded-lg">
        
        {/* Spinner */}
        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>

        <span>Under Maintenance...</span>
    </div>
    )}

    {/* Header */}
    <div className="bg-gradient-to-r from-sky-600 to-teal-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2">
      <span>Water Analysis</span>
    </div>

    <div className="p-4 space-y-4 bg-white">

      {/* Water Source */}
      <div className="flex items-center gap-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase">Water Source:</span>
          <select
            className="bg-gray-50 border rounded px-2 py-1 text-xs"
            value={waterSource}
            onChange={e => {
              const newSource = e.target.value;
              setWaterSource(newSource);
              if (newSource !== "custom") {
                applyWaterSourcePreset(newSource, waterSourcePresets[newSource].refSalinity);
              }
            }}
          >
            <option value="openSea">Open Sea</option>
            <option value="beachWell">Beach Well</option>
            <option value="brackishWater">Brackish Water</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold">S₀</span>
          <input
            type="number"
            className="w-20 bg-gray-50 border rounded px-2 py-1 text-xs text-center"
            value={fmt(S0)}
            onChange={e => setS0(parseFloat(e.target.value) || 0)}
          />
          <span className="text-xs">g/L</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <RowInput label="pH" unit="-" value={pH} onChange={setPH} info={INFO} />
          <RowInput label="T" unit="°C" value={T} onChange={setT} info={INFO} />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold uppercase">Balance:</span>
          <label><input type="radio" checked={balanceMode==="none"} onChange={()=>setBalanceMode("none")} /> None</label>
          <label><input type="radio" checked={balanceMode==="adjustNa"} onChange={()=>setBalanceMode("adjustNa")} /> Na⁺</label>
          <label><input type="radio" checked={balanceMode==="adjustCl"} onChange={()=>setBalanceMode("adjustCl")} /> Cl⁻</label>
        </div>
      </div>

{/* Tables */}
<div className="grid grid-cols-2 gap-8">

  {/* Cations */}
  <div>
    <h3 className="text-xs font-semibold tracking-wider text-gray-700 mb-2 uppercase">
      CATIONS
    </h3>

    <div className="grid grid-cols-[80px_1fr_100px] text-[11px] text-gray-500 pb-1 border-b">
      <div>ion</div>
      <div className="text-center">mg/l</div>
      <div className="text-right">meq/l</div>
    </div>

    <div className="divide-y divide-gray-100">
      {cationKeys.map(k => (
        <div key={k} className="grid grid-cols-[80px_1fr_100px] items-center py-1.5 text-xs">

          {/* ion */}
          <div className="text-gray-700 font-medium">{cationSymbols[k]}</div>

          {/* mg/l */}
          <div className="px-2">
            <div className="bg-gray-100 rounded-md px-2 py-1 text-center font-mono text-gray-800">
              {fmt(getMg(k))}
            </div>
          </div>

          {/* meq/l */}
          <div className="flex justify-end">
            <div className="bg-gray-200 rounded-md px-2 py-1 font-mono text-gray-800 min-w-[80px] text-right">
              {fmt(getMeq(k))}
            </div>
          </div>

        </div>
      ))}

      {/* Total */}
      <div className="grid grid-cols-[80px_1fr_100px] items-center pt-2 text-xs font-semibold">
        <div className="text-gray-700">Total</div>
        <div></div>
        <div className="text-right bg-gray-200 px-2 py-1 rounded-md font-mono">
          {fmt(totalCat)}
        </div>
      </div>
    </div>
  </div>

  {/* Anions + Neutral */}
  <div>
    <h3 className="text-xs font-semibold tracking-wider text-gray-700 mb-2 uppercase">
      ANIONS
    </h3>

    <div className="grid grid-cols-[80px_1fr_100px] text-[11px] text-gray-500 pb-1 border-b">
      <div>ion</div>
      <div className="text-center">mg/l</div>
      <div className="text-right">meq/l</div>
    </div>

    <div className="divide-y divide-gray-100">
      {anionKeys.map(k => (
        <div key={k} className="grid grid-cols-[80px_1fr_100px] items-center py-1.5 text-xs">

          <div className="text-gray-700 font-medium">{anionSymbols[k]}</div>

          <div className="px-2">
            <div className="bg-gray-100 rounded-md px-2 py-1 text-center font-mono text-gray-800">
              {fmt(getMg(k))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-gray-200 rounded-md px-2 py-1 font-mono text-gray-800 min-w-[80px] text-right">
              {fmt(getMeq(k))}
            </div>
          </div>

        </div>
      ))}

      {/* Total */}
      <div className="grid grid-cols-[80px_1fr_100px] items-center pt-2 text-xs font-semibold">
        <div className="text-gray-700">Total</div>
        <div></div>
        <div className="text-right bg-gray-200 px-2 py-1 rounded-md font-mono">
          {fmt(totalAn)}
        </div>
      </div>
    </div>

    {/* Neutral */}
    <h3 className="text-xs font-semibold tracking-wider text-gray-700 mt-5 mb-2 uppercase">
      NEUTRAL SPECIES
    </h3>

    <div className="grid grid-cols-[80px_1fr_100px] text-[11px] text-gray-500 pb-1 border-b">
      <div>species</div>
      <div className="text-center">mg/l</div>
      <div className="text-right">meq/l</div>
    </div>

    <div className="divide-y divide-gray-100">
      {neutralKeys.map(k => (
        <div key={k} className="grid grid-cols-[80px_1fr_100px] items-center py-1.5 text-xs">

          <div className="text-gray-700 font-medium">{neutralSymbols[k]}</div>

          <div className="px-2">
            <div className="bg-gray-100 rounded-md px-2 py-1 text-center font-mono text-gray-800">
              {fmt(ions[k])}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-gray-200 rounded-md px-2 py-1 font-mono text-gray-400 min-w-[80px] text-right">
              —
            </div>
          </div>

        </div>
      ))}
    </div>

  </div>
</div>

{/* Summary */}
<div className="border-t border-gray-200 pt-3 mt-2">
  <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
    Summary
  </h3>

  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">

    <div className="flex justify-between">
      <span>TDS</span>
      <span className="font-mono font-semibold">{fmt(tds)} mg/L</span>
    </div>

    <div className="flex justify-between">
      <span>Total Hardness (CaCO₃)</span>
      <span className="font-mono font-semibold">{fmt(hardnessCaCO3)} mg/L</span>
    </div>

    <div className="flex justify-between items-center">
      <span>Ion Balance Error</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold">{fmt(balanceErr)}%</span>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
          ${absErr < 2
            ? "bg-green-100 text-green-700"
            : absErr < 5
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"}`}
        >
          {absErr < 2 ? "Excellent" : absErr < 5 ? "Acceptable" : "Poor"}
        </span>
      </div>
    </div>

    <div className="flex justify-between">
      <span>Total Alkalinity (CaCO₃)</span>
      <span className="font-mono font-semibold">{fmt(alkCaCO3)} mg/L</span>
    </div>

    <div className="flex justify-between">
      <span>Ionic Strength</span>
      <span className="font-mono font-semibold">{fmt(ionicStr)} mol/L</span>
    </div>

  </div>
</div>


{/* LSI */}
<div className="border-t border-gray-200 pt-3 mt-2">
  <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
    Langelier Saturation Index (LSI)
  </h3>

  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">

    <div className="flex justify-between">
      <span>A (TDS factor)</span>
      <span className="font-mono">{fmt(lsiA)}</span>
    </div>

    <div className="flex justify-between">
      <span>B (Temperature factor)</span>
      <span className="font-mono">{fmt(lsiB)}</span>
    </div>

    <div className="flex justify-between">
      <span>C (Calcium factor)</span>
      <span className="font-mono">{fmt(lsiC)}</span>
    </div>

    <div className="flex justify-between">
      <span>D (Alkalinity factor)</span>
      <span className="font-mono">{fmt(lsiD)}</span>
    </div>

    <div className="flex justify-between">
      <span>pHs (Saturation pH)</span>
      <span className="font-mono font-semibold">{fmt(pHs)}</span>
    </div>

    <div className="flex justify-between items-center">
      <span>LSI</span>

      <div className="flex items-center gap-2">
        <span className="font-mono font-bold">{fmt(lsi)}</span>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
          ${
            lsi > 0.5
              ? "bg-red-100 text-red-700"
              : lsi > -0.5
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {lsi > 0.5
            ? "Scale-forming"
            : lsi > -0.5
            ? "Balanced"
            : "Corrosive"}
        </span>
      </div>
    </div>

  </div>
</div>


{/* Raw Water Test */}
<div className="border-t border-gray-200 pt-3 mt-2">
  <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
    Raw Water Test
  </h3>

  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">

    {[
      ["Turbidity", turbidity, setTurbidity, "NTU"],
      ["SDI", sdi, setSdi, "-"],
      ["TSS", tss, setTss, "mg/L"],
      ["COD", cod, setCod, "mg/L"],
      ["BOD", bod, setBod, "mg/L"],
      ["Total Bacteria", totalBacteria, setTotalBacteria, "CFU/ml"],
      ["Coliform", coliform, setColiform, "MPN/100ml"],
    ].map(([label, val, setter, unit]) => (
      <div key={label} className="flex justify-between items-center">
        <span>{label}</span>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={val}
            onChange={(e) => setter(parseFloat(e.target.value) || 0)}
            className="w-16 text-center bg-gray-50 border border-gray-200 rounded px-1 py-0.5 font-mono text-xs focus:ring-1 focus:ring-teal-400"
          />
          <span className="text-gray-500 text-[10px]">{unit}</span>
        </div>
      </div>
    ))}

  </div>
</div>


{/* Pretreatment */}
<div className="border-t border-gray-200 pt-3 mt-2">
  <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
    Pretreatment Selection
  </h3>

  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">

    <div className="flex justify-between">
      <span>Recommended PT</span>
      <span className="font-mono font-semibold">
        {sdi > 5 || turbidity > 10 || tss > 50
          ? "MF/UF"
          : sdi > 3 || turbidity > 5 || tss > 20 || cod > 30 || bod > 15 || totalBacteria > 10000
          ? "NF"
          : "Media"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Disinfection Required</span>
      <span className="font-mono font-semibold">
        {totalBacteria > 1000 || coliform > 10 ? "Yes" : "No"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Biological Treatment</span>
      <span className="font-mono font-semibold">
        {cod > 50 || bod > 25
          ? "Required"
          : bod > 10
          ? "Recommended"
          : "Not Required"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Coagulation Required</span>
      <span className="font-mono font-semibold">
        {turbidity > 5 || tss > 10 ? "Yes" : "No"}
      </span>
    </div>

  </div>
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
        <DollarSign className="w-4 h-4" />
        <span className="text-base">{title}</span>
      </div>

      {/* Body */}
      <div className="p-2">{children}</div>
    </div>
  );
}
function RowInput({ label, unit, value, onChange, autoFocus, info, compact }) {
  return (
    <div className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 ${compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"}`}>
      
      {/* Label */}
      {info[label] ? (
        <Tooltip text={info[label]}>
          <div className="font-semibold text-gray-600 underline decoration-dashed underline-offset-4 cursor-help whitespace-nowrap">
            {label}
          </div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-gray-600 whitespace-nowrap">{label}</div>
      )}

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        onClick={(e) => e.target.select()}
        dir="ltr"
        inputMode="decimal"
        autoFocus={autoFocus}
        className={`
          w-full font-mono text-center
          ${compact ? "py-1 text-xs rounded-md" : "py-2 text-sm rounded-lg"}
          bg-gradient-to-b from-gray-50 to-gray-100
          border border-gray-200
          outline-none
          transition-all duration-200
          focus:ring-1 focus:ring-teal-400
          focus:border-teal-400
          focus:bg-white
          hover:border-gray-300
        `}
        placeholder="0"
      />

      {/* Unit */}
      <div className="text-right whitespace-nowrap" dir="ltr">
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-gray-500 font-medium underline decoration-dashed underline-offset-3">
            {unit}
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

function RowView({ label, value, unit, info, highlight }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-1 text-xs">
      
      {/* Label */}
      {info[label] ? (
        <Tooltip text={info[label]}>
          <div className="font-semibold text-gray-600 underline decoration-dashed underline-offset-4 cursor-help whitespace-nowrap">
            {label}
          </div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-gray-600 whitespace-nowrap">{label}</div>
      )}

      {/* Value */}
      <div
        className={`
          text-center font-mono
          px-2 py-1 rounded-lg border
          ${highlight 
            ? "bg-teal-50 border-teal-200 text-teal-700 font-semibold"
            : "bg-gray-50 border-gray-200 text-gray-800"}
        `}
      >
        {value}
      </div>

      {/* Unit */}
      <div className="text-right whitespace-nowrap" dir="ltr">
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-gray-500 font-medium underline decoration-dashed underline-offset-3">
            {unit}
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
