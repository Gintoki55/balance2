
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
const INFO = {
  Nst: "Number of MSF stages",
  Nef1: "Number of upper MED effects",
  Nef2: "Number of lower MED effects",

  Aa: "Brine heater area",
  Ab: "Each MSF stage area",
  Ac: "Each upper MED effect area",
  Ad: "Each lower MED effect area",
  Ae: "Each preheater area",
  Af: "Absorber heat transfer area",

  P0: "Intake pump pressure",
  Pd: "Discharge pump pressure",

  VC: "Vapor compressor capacity",
  AZ: "Absorber capacity",

  Md: "Product water capacity",
  M0: "Raw feed water",
  Mf: "Feed water flow",

  SEC: "Specific steam exergy",
  ELC: "Electricity consumption",

  Danti: "Antiscalant dosing rate",
  Dacid: "Acid dosing rate",

  pV: "Feed water pH",

  Th: "Brine heater temperature",
  Td: "Distillate temperature",
  T0: "Feed water temperature",
  S0: "Feed water salinity",

  "#": "Dimensionless",
  "m²": "Square meters",
  "bar": "Bar",
  "m³/s": "Cubic meters per second",
  "t/h": "Metric tons per hour",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "-": "Dimensionless",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",
    Y: "Life span",
  LF: "Load factor",
  r: "Discount rate",

  Caa: "Brine heater area cost",
  Cab: "MSF stage area cost",
  Cac: "Upper MED effect area cost",
  Cad: "Lower MED effect area cost",
  Cae: "Preheater area cost",
  Caf: "Absorber area cost",

  Cp0: "Intake pump cost factor",
  Cpd: "Discharge pump cost factor",
  Cvc: "Vapor compressor capacity factor",
  Caz: "Absorber capacity factor",
  Cwt: "Water treatment cost factor",
  Cintake: "Intake structure cost factor",

  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Csec: "Steam exergy cost",
  Celc: "Electricity price",
  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",
  Clabor: "Labor cost factor",

  Cmain: "Annual maintenance cost as percentage of total CAPEX",
  Cover: "Overhead cost % of OPEX-total",

  "$": "Dollars",
  "$/(m²)": "Dollars per square meter",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(m³/s)": "Dollars per m³/s",
  "$/(t/h)": "Dollars per t/h",
  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",
  "%": "Percent",
  "%/yr": "Percent per year",
  "-": "Dimensionless",
  "yr": "Years",
  CAPEX_area: "Total heat transfer area CAPEX",
  CAPEX_Pump: "Pump CAPEX",
  CAPEX_wt: "Water treatment CAPEX",
  CAPEX_intake: "Intake structure CAPEX",
  CAPEX_vc: "Vapor compressor CAPEX",
  CAPEX_az: "Absorber CAPEX",
  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works CAPEX",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",
  CAPEX_total: "Total CAPEX",
  CAPX_spec: "Specific CAPEX",
  CRF: "Capital recovery factor",
  Ucap: "Annualized capital cost",

  OPEX_sec: "Specific exergy consumption cost",
  OPEX_elc: "Electricity cost",
  OPEX_anti: "Antiscalant cost",
  OPEX_acid: "Acid cost",
  OPEX_labor: "Labor cost",
  OPEX_maint: "Maintenance cost",
  OPEX_over: "Overhead cost",
  OPEX_total: "Total OPEX",
  UPC: "Unit Production Cost",

  "$": "Dollars",
  "$/(t/h)": "Dollars per t/h",
  "-": "Dimensionless",
  "$/t": "Dollars per metric ton",
  "$/(m²)": "Dollars per square meter",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(m³/s)": "Dollars per m³/s",
  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",
  "%": "Percent",
  "%/yr": "Percent per year",
  "yr": "Years",
  "$/m²":"Dollars per square meter"
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


export default function MSHWaterCost(){


      const exportPDF = () => {
        const doc = new jsPDF();
      
        // 🔹 عنوان رئيسي
        doc.setFontSize(16);
        doc.text("MSH Water Cost", 10, 15);
      
        let currentY = 25;
      
        // ===== Inputs =====
        const inputRows = inputData
          .filter(row => row.symbol !== "Inputs")
          .map(row => [row.symbol, row.value, row.unit]);
      
        doc.setFontSize(12);
        doc.text("Inputs", 10, currentY);
      
        autoTable(doc, {
          startY: currentY + 5,
          head: [["Symbol", "Value", "Unit"]],
          body: inputRows,
          showHead: 'firstPage', // مهم: العنوان يظهر فقط في أول صفحة للجدول
          theme: 'grid',
        });
      
        currentY = doc.lastAutoTable.finalY + 10;
      
        // ===== Factors =====
        const factorRows = FactorsData
          .filter(row => row.symbol !== "Factor")
          .map(row => [row.symbol, row.value, row.unit]);
      
        doc.text("Factors", 10, currentY);
      
        autoTable(doc, {
          startY: currentY + 5,
          head: [["Symbol", "Value", "Unit"]],
          body: factorRows,
          showHead: 'firstPage', // العنوان فقط في أول صفحة من هذا الجدول
          theme: 'grid',
        });
      
        currentY = doc.lastAutoTable.finalY + 10;
      
        // ===== Outputs =====
        const outputRows = outputData
          .filter(row => row.symbol !== "Outputs")
          .map(row => [row.symbol, row.value, row.unit]);
      
        doc.text("Outputs", 10, currentY);
      
        autoTable(doc, {
          startY: currentY + 5,
          head: [["Symbol", "Value", "Unit"]],
          body: outputRows,
          showHead: 'firstPage', // العنوان فقط في أول صفحة من الجدول
          theme: 'grid',
        });
      
        // 🔹 حفظ
        doc.save("MSH_Water_Cost.pdf");
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
      
        // 🟢 Sheet 2 (Inputs)
        const wsFactor = XLSX.utils.json_to_sheet(FactorsData);
      
        // ✅ هنا تحطها
        wsInputs["!cols"] = [
          { wch: 10 }, // symbol
          { wch: 15 }, // value
          { wch: 15 }, // unit
        ];
      
        XLSX.utils.book_append_sheet(wb, wsFactor, "Factor");
      
        // 🔵 Sheet 3 (Outputs)
        const wsOutputs = XLSX.utils.json_to_sheet(outputData);
      
        // ✅ وهنا أيضاً
        wsOutputs["!cols"] = [
          { wch: 10 },
          { wch: 15 },
          { wch: 15 },
        ];
      
        XLSX.utils.book_append_sheet(wb, wsOutputs, "Outputs");
      
        // 💾 حفظ الملف
        XLSX.writeFile(wb, "MSH_Water_Cost.xlsx");
      };

        // Group 1: Simulator Inputs
  const [Md, setMd] = usePersistentState("msh.Md", 50000); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("msh.M0", 55000); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("msh.Mf", 60000); // Feed water flow (t/h)
  const [Nst, setNst] = usePersistentState("msh.Nst", 12); // Number of MSF stages
  const [Nef1, setNef1] = usePersistentState("msh.Nef1", 6); // Number of upper MED effects
  const [Nef2, setNef2] = usePersistentState("msh.Nef2", 6); // Number of lower MED effects
  const [Aa, setAa] = usePersistentState("msh.Aa", 2000); // Brine heater area (m²)
  const [Ab, setAb] = usePersistentState("msh.Ab", 1500); // Each MSF stage area (m²)
  const [Ac, setAc] = usePersistentState("msh.Ac", 1200); // Each upper MED effect area (m²)
  const [Ad, setAd] = usePersistentState("msh.Ad", 1200); // Each lower MED effect area (m²)
  const [Ae, setAe] = usePersistentState("msh.Ae", 1000); // Each preheater area (m²)
  const [Af, setAf] = usePersistentState("msh.Af", 800); // Absorber heat transfer area (m²)
  const [P0, setP0] = usePersistentState("msh.P0", 2); // Intake pump pressure (bar)
  const [Pd, setPd] = usePersistentState("msh.Pd", 2.5); // Discharge pump pressure (bar)
  const [VC, setVC] = usePersistentState("msh.VC", 0); // Vapor compressor capacity (m³/s)
  const [AZ, setAZ] = usePersistentState("msh.AZ", 0); // Absorber capacity (m³/s)
  const [SEC, setSEC] = usePersistentState("msh.SEC", 120); // Specific steam exergy (MJ/t)
  const [ELC, setELC] = usePersistentState("msh.ELC", 5); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("msh.Danti", 3); // Antiscalant dosing (L/h)
  const [Dacid, setDacid] = usePersistentState("msh.Dacid", 1.5); // Acid dosing (L/h)
  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("msh.pV", 7.5); // Feed water pH
  const [Th, setTh] = usePersistentState("msh.Th", 115); // Brine heater temperature (°C)
  const [Td, setTd] = usePersistentState("msh.Td", 40); // Distillate temperature (°C)
  const [T0, setT0] = usePersistentState("msh.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("msh.S0", 40); // Feed water salinity (g/L)
  const [Y, setY] = usePersistentState("msh.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("msh.LF", 0.90); // Load factor
  const [r, setR] = usePersistentState("msh.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  const [Caa, setCaa] = usePersistentState("msh.Caa", 150); // Brine heater area cost ($/m²)
  const [Cab, setCab] = usePersistentState("msh.Cab", 140); // MSF stage area cost ($/m²)
  const [Cac, setCac] = usePersistentState("msh.Cac", 130); // Upper MED effect area cost ($/m²)
  const [Cad, setCad] = usePersistentState("msh.Cad", 130); // Lower MED effect area cost ($/m²)
  const [Cae, setCae] = usePersistentState("msh.Cae", 120); // Preheater area cost ($/m²)
  const [Caf, setCaf] = usePersistentState("msh.Caf", 100); // Absorber area cost ($/m²)
  const [Cp0, setCp0] = usePersistentState("msh.Cp0", 8); // Intake pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("msh.Cpd", 10); // Discharge pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("msh.Cwt", 100); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("msh.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Csec, setCsec] = usePersistentState("msh.Csec", 0.02); // Steam exergy price ($/MJ)
  const [Celc, setCelc] = usePersistentState("msh.Celc", 0.022); // Electricity price ($/MJ)
  const [Cvc, setCvc] = usePersistentState("msh.Cvc", 0); // VC cost factor ($/(m³/s))
  const [Caz, setCaz] = usePersistentState("msh.Caz", 0); // Absorber capacity factor ($/(m³/s))
  const [Canti, setCanti] = usePersistentState("msh.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("msh.Cacid", 0.3); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("msh.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("msh.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("msh.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cinst, setCinst] = usePersistentState("msh.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("msh.Ceng", 8); // Engineering cost (% of equipment)
  const [Ccivil, setCcivil] = usePersistentState("msh.Ccivil", 5); // Civil works cost (% of CAPEX_equip)

  // Reset function
  const resetToDefaults = () => {
    setMd(50000);
    setM0(55000);
    setMf(60000);
    setNst(12);
    setNef1(6);
    setNef2(6);
    setAa(2000);
    setAb(1500);
    setAc(1200);
    setAd(1200);
    setAe(1000);
    setAf(800);
    setP0(2);
    setPd(2.5);
    setVC(0);
    setAZ(0);
    setSEC(120);
    setELC(5);
    setDanti(3);
    setDacid(1.5);
    setpV(7.5);
    setTh(115);
    setTd(40);
    setT0(30);
    setS0(40);
    setY(25);
    setLF(0.90);
    setR(0.06);
    setCaa(150);
    setCab(140);
    setCac(130);
    setCad(130);
    setCae(120);
    setCaf(100);
    setCp0(8);
    setCpd(10);
    setCwt(100);
    setCintake(50);
    setCsec(0.02);
    setCelc(0.022);
    setCvc(0);
    setCaz(0);
    setCanti(2.5);
    setCacid(0.3);
    setClabor(0.05);
    setCmain(2);
    setCover(10);
    setCinst(15);
    setCeng(8);
    setCcivil(5);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;

  // CAPEX Calculations
  const CAPEX_area = Aa * Caa + Nst * Ab * Cab + Nef1 * Ac * Cac + Nef2 * Ad * Cad + (Nef2 + 1) * Ae * Cae + Af * Caf;
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8); // Intake pump
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Mf, 0.8); // Discharge pump
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_d;
  const CAPEX_wt = M0 * Cwt;
  const CAPEX_intake = M0 * Cintake;
  const CAPEX_vc = VC * Cvc;
  const CAPEX_az = AZ * Caz;
  const CAPEX_equip = CAPEX_area + CAPEX_Pump + CAPEX_wt + CAPEX_intake + CAPEX_vc + CAPEX_az;
  const CAPEX_civil = 0.05 * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
  const CAPEX_total = CAPEX_equip + CAPEX_civil + CAPEX_inst + CAPEX_eng;

  // CRF and annualized capital cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const Ucap = (CAPEX_total * CRF) / annualProduction;
  const CAPX_spec = CAPEX_total / Md;

  // OPEX Calculations
  const OPEX_sec = SEC * Csec; // Steam cost ($/t)
  const OPEX_elc = ELC * Celc; // Electricity cost ($/t)
  const Cantiscalant = (Danti * Canti) / Md;
  const Cacid_dose = (Dacid * Cacid) / Md;
  const Cmain_annual = (Cmain / 100) * CAPEX_total / annualProduction;
  const OPEX_total = OPEX_sec + OPEX_elc + Cantiscalant + Cacid_dose + Clabor + Cmain_annual;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;

  // Total Unit Production Cost
  const UPC = Ucap + OPEX_total_with_overhead;

  const inputData = [
  { symbol: "Nst", value: fmt(Nst), unit: "#" },
  { symbol: "Nef1", value: fmt(Nef1), unit: "#" },
  { symbol: "Nef2", value: fmt(Nef2), unit: "#" },

  { symbol: "Aa", value: fmt(Aa), unit: "m²" },
  { symbol: "Ab", value: fmt(Ab), unit: "m²" },
  { symbol: "Ac", value: fmt(Ac), unit: "m²" },
  { symbol: "Ad", value: fmt(Ad), unit: "m²" },
  { symbol: "Ae", value: fmt(Ae), unit: "m²" },
  { symbol: "Af", value: fmt(Af), unit: "m²" },

  { symbol: "P0", value: fmt(P0), unit: "bar" },
  { symbol: "Pd", value: fmt(Pd), unit: "bar" },

  { symbol: "VC", value: fmt(VC), unit: "m³/s" },
  { symbol: "AZ", value: fmt(AZ), unit: "m³/s" },

  { symbol: "Md", value: fmt(Md), unit: "t/h" },
  { symbol: "M0", value: fmt(M0), unit: "t/h" },
  { symbol: "Mf", value: fmt(Mf), unit: "t/h" },

  { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
  { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },

  { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
  { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },

  { symbol: "pV", value: fmt(pV), unit: "-" },

  { symbol: "Th", value: fmt(Th), unit: "°C" },
  { symbol: "Td", value: fmt(Td), unit: "°C" },
  { symbol: "T0", value: fmt(T0), unit: "°C" },

  { symbol: "S0", value: fmt(S0), unit: "g/L" },
];

const FactorsData = [
  { symbol: "Y", value: fmt(Y), unit: "yr" },
  { symbol: "LF", value: fmt(LF), unit: "-" },
  { symbol: "r", value: fmt(r), unit: "-" },

  { symbol: "Caa", value: fmt(Caa), unit: "$/m²" },
  { symbol: "Cab", value: fmt(Cab), unit: "$/m²" },
  { symbol: "Cac", value: fmt(Cac), unit: "$/m²" },
  { symbol: "Cad", value: fmt(Cad), unit: "$/m²" },
  { symbol: "Cae", value: fmt(Cae), unit: "$/m²" },
  { symbol: "Caf", value: fmt(Caf), unit: "$/m²" },

  { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
  { symbol: "Cpd", value: fmt(Cpd), unit: "$/(bar·t/h)" },
  { symbol: "Cvc", value: fmt(Cvc), unit: "$/(m³/s)" },
  { symbol: "Caz", value: fmt(Caz), unit: "$/(m³/s)" },

  { symbol: "Cwt", value: fmt(Cwt), unit: "$/(t/h)" },
  { symbol: "Cintake", value: fmt(Cintake), unit: "$/(t/h)" },

  { symbol: "Cinst", value: fmt(Cinst), unit: "%" },
  { symbol: "Ceng", value: fmt(Ceng), unit: "%" },

  { symbol: "Csec", value: fmt(Csec), unit: "$/MJ" },
  { symbol: "Celc", value: fmt(Celc), unit: "$/MJ" },
  { symbol: "Canti", value: fmt(Canti), unit: "$/L" },
  { symbol: "Cacid", value: fmt(Cacid), unit: "$/L" },
  { symbol: "Clabor", value: fmt(Clabor), unit: "$/t" },
  { symbol: "Cmain", value: fmt(Cmain), unit: "%/yr" },
  { symbol: "Cover", value: fmt(Cover), unit: "%" },
];

const outputData = [
  { symbol: "CAPEX_area", value: fmt(CAPEX_area), unit: "$" },
  { symbol: "CAPEX_Pump", value: fmt(CAPEX_Pump), unit: "$" },
  { symbol: "CAPEX_wt", value: fmt(CAPEX_wt), unit: "$" },
  { symbol: "CAPEX_intake", value: fmt(CAPEX_intake), unit: "$" },
  { symbol: "CAPEX_vc", value: fmt(CAPEX_vc), unit: "$" },
  { symbol: "CAPEX_az", value: fmt(CAPEX_az), unit: "$" },

  { symbol: "CAPEX_equip", value: fmt(CAPEX_equip), unit: "$" },
  { symbol: "CAPEX_civil", value: fmt(CAPEX_civil), unit: "$" },
  { symbol: "CAPEX_inst", value: fmt(CAPEX_inst), unit: "$" },
  { symbol: "CAPEX_eng", value: fmt(CAPEX_eng), unit: "$" },

  { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
  { symbol: "CAPX_spec", value: fmt(CAPX_spec), unit: "$/(t/h)" },

  { symbol: "CRF", value: fmt(CRF), unit: "-" },
  { symbol: "Ucap", value: fmt(Ucap), unit: "$/t" },

  { symbol: "OPEX_sec", value: fmt(OPEX_sec), unit: "$/t" },
  { symbol: "OPEX_elc", value: fmt(OPEX_elc), unit: "$/t" },
  { symbol: "OPEX_anti", value: fmt(Cantiscalant), unit: "$/t" },
  { symbol: "OPEX_acid", value: fmt(Cacid_dose), unit: "$/t" },

  { symbol: "OPEX_labor", value: fmt(Clabor), unit: "$/t" },
  { symbol: "OPEX_maint", value: fmt(Cmain_annual), unit: "$/t" },
  { symbol: "OPEX_over", value: fmt(Cover_annual), unit: "$/t" },
  { symbol: "OPEX_total", value: fmt(OPEX_total_with_overhead), unit: "$/t" },

  { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
];
    
          return (
            <div className="max-w-6xl mx-auto w-full space-y-3 my-5">
    
              <Section title="MSH Water Cost">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* ================= COLUMN 1 ================= */}
                  <div>
                    <div className="text-sm font-semibold text-gray-400 mb-2">
                      Inputs
                    </div>
                    <RowInput label="Nst" unit="#" value={Nst} onChange={setNst} info={INFO} />
                    <RowInput label="Nef1" unit="#" value={Nef1} onChange={setNef1} info={INFO} />
                    <RowInput label="Nef2" unit="#" value={Nef2} onChange={setNef2} info={INFO} />

                    <RowInput label="Aa" unit="m²" value={Aa} onChange={setAa} info={INFO} />
                    <RowInput label="Ab" unit="m²" value={Ab} onChange={setAb} info={INFO} />
                    <RowInput label="Ac" unit="m²" value={Ac} onChange={setAc} info={INFO} />
                    <RowInput label="Ad" unit="m²" value={Ad} onChange={setAd} info={INFO} />
                    <RowInput label="Ae" unit="m²" value={Ae} onChange={setAe} info={INFO} />
                    <RowInput label="Af" unit="m²" value={Af} onChange={setAf} info={INFO} />

                    <RowInput label="P0" unit="bar" value={P0} onChange={setP0} info={INFO} />
                    <RowInput label="Pd" unit="bar" value={Pd} onChange={setPd} info={INFO} />

                    <RowInput label="VC" unit="m³/s" value={VC} onChange={setVC} info={INFO} />
                    <RowInput label="AZ" unit="m³/s" value={AZ} onChange={setAZ} info={INFO} />

                    <RowInput label="Md" unit="t/h" value={Md} onChange={setMd} info={INFO} />
                    <RowInput label="M0" unit="t/h" value={M0} onChange={setM0} info={INFO} />
                    <RowInput label="Mf" unit="t/h" value={Mf} onChange={setMf} info={INFO} />

                    <RowInput label="SEC" unit="MJ/t" value={SEC} onChange={setSEC} info={INFO} />
                    <RowInput label="ELC" unit="MJ/t" value={ELC} onChange={setELC} info={INFO} />

                    <RowInput label="Danti" unit="L/h" value={Danti} onChange={setDanti} info={INFO} />
                    <RowInput label="Dacid" unit="L/h" value={Dacid} onChange={setDacid} info={INFO} />

                    <RowInput label="pV" unit="-" value={pV} onChange={setpV} info={INFO} />

                    <RowInput label="Th" unit="°C" value={Th} onChange={setTh} info={INFO} />
                    <RowInput label="Td" unit="°C" value={Td} onChange={setTd} info={INFO} />
                    <RowInput label="T0" unit="°C" value={T0} onChange={setT0} info={INFO} />

                    <RowInput label="S0" unit="g/L" value={S0} onChange={setS0} info={INFO} />

                                        
                  </div>
        
                  {/* ================= COLUMN 2 ================= */}
                  <div>
                    <div className="text-sm font-semibold text-gray-400 mb-2">
                      Factors
                    </div>
                     <RowInput label="Y" unit="yr" value={Y} onChange={setY} info={INFO} />
                    <RowInput label="LF" unit="-" value={LF} onChange={setLF} info={INFO} />
                    <RowInput label="r" unit="-" value={r} onChange={setR} info={INFO} />
                    <RowInput label="Caa" unit="$/m²" value={Caa} onChange={setCaa} info={INFO} />
                    <RowInput label="Cab" unit="$/m²" value={Cab} onChange={setCab} info={INFO} />
                    <RowInput label="Cac" unit="$/m²" value={Cac} onChange={setCac} info={INFO} />
                    <RowInput label="Cad" unit="$/m²" value={Cad} onChange={setCad} info={INFO} />
                    <RowInput label="Cae" unit="$/m²" value={Cae} onChange={setCae} info={INFO} />
                    <RowInput label="Caf" unit="$/m²" value={Caf} onChange={setCaf} info={INFO} />

                    <RowInput label="Cp0" unit="$/(bar·t/h)" value={Cp0} onChange={setCp0} info={INFO} />
                    <RowInput label="Cpd" unit="$/(bar·t/h)" value={Cpd} onChange={setCpd} info={INFO} />
                    <RowInput label="Cvc" unit="$/(m³/s)" value={Cvc} onChange={setCvc} info={INFO} />
                    <RowInput label="Caz" unit="$/(m³/s)" value={Caz} onChange={setCaz} info={INFO} />

                    <RowInput label="Cwt" unit="$/(t/h)" value={Cwt} onChange={setCwt} info={INFO} />
                    <RowInput label="Cintake" unit="$/(t/h)" value={Cintake} onChange={setCintake} info={INFO} />

                    <RowInput label="Cinst" unit="%" value={Cinst} onChange={setCinst} info={INFO} />
                    <RowInput label="Ceng" unit="%" value={Ceng} onChange={setCeng} info={INFO} />

                    <RowInput label="Csec" unit="$/MJ" value={Csec} onChange={setCsec} info={INFO} />
                    <RowInput label="Celc" unit="$/MJ" value={Celc} onChange={setCelc} info={INFO} />
                    <RowInput label="Canti" unit="$/L" value={Canti} onChange={setCanti} info={INFO} />
                    <RowInput label="Cacid" unit="$/L" value={Cacid} onChange={setCacid} info={INFO} />
                    <RowInput label="Clabor" unit="$/t" value={Clabor} onChange={setClabor} info={INFO} />
                    <RowInput label="Cmain" unit="%/yr" value={Cmain} onChange={setCmain} info={INFO} />
                    <RowInput label="Cover" unit="%" value={Cover} onChange={setCover} info={INFO} />

                  </div>
        
                  {/* ================= OUTPUTS ================= */}
                  <div>
                    <div className="text-sm font-semibold text-gray-400 mb-2">
                      Outputs
                    </div>
                    {/* ===== TOP OUTPUTS (CAPEX) ===== */}
                    <RowView label="CAPEX_area" value={fmt(CAPEX_area)} unit="$" info={INFO} />
                    <RowView label="CAPEX_Pump" value={fmt(CAPEX_Pump)} unit="$" info={INFO} />
                    <RowView label="CAPEX_wt" value={fmt(CAPEX_wt)} unit="$" info={INFO} />
                    <RowView label="CAPEX_intake" value={fmt(CAPEX_intake)} unit="$" info={INFO} />
                    <RowView label="CAPEX_vc" value={fmt(CAPEX_vc)} unit="$" info={INFO} />
                    <RowView label="CAPEX_az" value={fmt(CAPEX_az)} unit="$" info={INFO} />

                    <RowView label="CAPEX_equip" value={fmt(CAPEX_equip)} unit="$" info={INFO} />
                    <RowView label="CAPEX_civil" value={fmt(CAPEX_civil)} unit="$" info={INFO} />
                    <RowView label="CAPEX_inst" value={fmt(CAPEX_inst)} unit="$" info={INFO} />
                    <RowView label="CAPEX_eng" value={fmt(CAPEX_eng)} unit="$" info={INFO} />

                    <RowView label="CAPEX_total" value={fmt(CAPEX_total)} unit="$" info={INFO} />
                    <RowView label="CAPX_spec" value={fmt(CAPX_spec)} unit="$/(t/h)" info={INFO} />

                    <RowView label="CRF" value={fmt(CRF)} unit="-" info={INFO} />
                    <RowView label="Ucap" value={fmt(Ucap)} unit="$/t" info={INFO} />

                    {/* ===== SECOND OUTPUTS (OPEX) ===== */}
                    <div className="border-t border-gray-700 mt-4 pt-3">
                      <div className="text-sm font-semibold text-gray-400 mb-2">
                        Outputs
                      </div>
                        <RowView label="OPEX_sec" value={fmt(OPEX_sec)} unit="$/t" info={INFO} />
                        <RowView label="OPEX_elc" value={fmt(OPEX_elc)} unit="$/t" info={INFO} />
                        <RowView label="OPEX_anti" value={fmt(Cantiscalant)} unit="$/t" info={INFO} />
                        <RowView label="OPEX_acid" value={fmt(Cacid_dose)} unit="$/t" info={INFO} />

                        <RowView label="OPEX_labor" value={fmt(Clabor)} unit="$/t" info={INFO} />
                        <RowView label="OPEX_maint" value={fmt(Cmain_annual)} unit="$/t" info={INFO} />
                        <RowView label="OPEX_over" value={fmt(Cover_annual)} unit="$/t" info={INFO} />
                        <RowView label="OPEX_total" value={fmt(OPEX_total_with_overhead)} unit="$/t" info={INFO} />

                        <RowView label="UPC" value={fmt(UPC)} unit="$/t" info={INFO} />
                    </div>
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
              </Section>
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
function RowInput({ label, unit, value, onChange, autoFocus, info }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 text-l">
      {info[label] ? (
        <Tooltip text={info[label]}>
          <div className="font-semibold text-gray-600 underline decoration-dashed underline-offset-5 cursor-help">
            {label}
          </div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-gray-600">{label}</div>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
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
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-4">
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
          <div className="font-semibold text-gray-600 underline decoration-dashed underline-offset-5 cursor-help">
            {label}
          </div>
        </Tooltip>
      ) : (
        <div className="font-semibold text-gray-600">{label}</div>
      )}

      <div className="text-center font-mono text-black bg-blue-50 rounded-xl p-2 border border-gray-200">
        {value}
      </div>

      <div className="text-right" dir="ltr">
        <Tooltip text={info[unit]}>
          <span className="cursor-help text-gray-600 font-semibold underline decoration-dashed underline-offset-5">
            {unit}
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
