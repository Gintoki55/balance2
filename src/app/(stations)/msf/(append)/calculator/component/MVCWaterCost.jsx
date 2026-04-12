
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
  Nef: "Number of effects",
  Aa: "Area of each effect",
  Ab: "Heat exchanger area",
  Md: "Product water capacity",
  M0: "Raw feed water",
  Mf: "Feed water flow",
  Mb: "Brine blowdown flow",

  P0: "Intake pump pressure",
  Pf: "Feed water pump pressure",
  Pb: "Brine discharge pump pressure",
  Pd: "Product pump pressure",

  VC: "Vapor compressor capacity",
  Pvc: "Vapor compressor power",

  SEC: "Specific compression exergy",
  ELC: "Electricity consumption",

  Danti: "Antiscalant chemical dosing rate",
  Dacid: "Acid chemical dosing rate",

  pV: "Feed water pH",

  Ts: "Steam temperature",
  Te: "Entrained vapor temperature",
  T0: "Feed water temperature",
  S0: "Feed water salinity",

  "#": "Dimensionless",
  "m²": "Square meters",
  "t/h": "Metric tons per hour",
  "bar": "Bar",
  "m³/s": "Cubic meters per second",
  "kW": "Kilowatts",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",
  "-": "Dimensionless",
  Y: "Life span",
  LF: "Load factor",
  r: "Discount rate",

  Cef: "Effect installation cost factor",
  Caa: "Effect area cost factor",
  Cab: "Heat exchanger area cost factor",

  Cvc: "Vapor compressor capacity factor",

  Cp0: "Intake pump cost factor",
  Cpf: "Feed pump cost factor",
  Cpb: "Brine discharge pump cost factor",
  Cpd: "Product pump cost factor",

  Cwt: "Water pretreatment and posttreatment cost factor",
  Cintake: "Intake structure cost factor",

  Ccivil: "Civil works cost % of CAPEX_equip",
  Cinstr: "Instrumentation cost % of equipment",
  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Csec: "Specific compression exergy cost",
  Celc: "Electricity price",

  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",
  Clabor: "Labor cost factor",

  Cmain: "Annual maintenance cost as percentage of total CAPEX",
  Cover: "Overhead cost % of OPEX-total",

  "$/(effect)": "Dollars per effect",
  "$/(m²)": "Dollars per square meter",
  "$/(m³/s)": "Dollars per m³ per second",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(t/h)": "Dollars per t/h",
  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",
  "%": "Percent",
  "%/yr": "Percent per year",
  "-": "Dimensionless",
  "yr": "Years",
  CAPEX_ef: "Effect CAPEX",
  CAPEX_area: "Total heat transfer area CAPEX",
  CAPEX_vc: "Vapor compressor CAPEX",
  CAPEX_Pump: "Pump CAPEX",
  CAPEX_wt: "Water treatment CAPEX",
  CAPEX_intake: "Intake structure CAPEX",
  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works CAPEX",
  CAPEX_instr: "Instrumentation cost",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",
  CAPEX_total: "Total CAPEX",
  CAPX_spec: "Specific CAPEX per unit capacity",
  CRF: "Capital recovery factor",
  Ucap: "Annualized capital cost per ton",

  OPEX_sec: "Specific exergy consumption cost",
  OPEX_elc: "Electricity cost",
  OPEX_anti: "Antiscalant dosing cost",
  OPEX_acid: "Acid dosing cost",
  OPEX_labor: "Labor cost",
  OPEX_maint: "Maintenance cost",
  OPEX_over: "Overhead cost",
  OPEX_total: "Total OPEX with overhead",
  UPC: "Unit Production Cost (UPC)",

  "$": "Dollars",
  "$/(t/h)": "Dollars per t/h",
  "-": "Dimensionless",
  "$/t": "Dollars per metric ton",
  "$/effect":"Dollars per effect",
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
export default function MVCWaterCost(){

    // Group 1: Simulator Inputs
  const [Nef, setNef] = usePersistentState("mvc.Nef", 5); // Number of effects
  const [Aa, setAa] = usePersistentState("mvc.Aa", 28320); // Area of each effect (m²)
  const [Ab, setAb] = usePersistentState("mvc.Ab", 21627); // Heat exchanger area (m²)
  const [Md, setMd] = usePersistentState("mvc.Md", 1000); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("mvc.M0", 2700); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("mvc.Mf", 3238); // Feed water flow (t/h)
  const [Mb, setMb] = usePersistentState("mvc.Mb", 1688); // Brine blowdown flow (t/h)
  const [P0, setP0] = usePersistentState("mvc.P0", 5); // Intake pump pressure (bar)
  const [Pf, setPf] = usePersistentState("mvc.Pf", 3); // Feed water pump pressure (bar)
  const [Pb, setPb] = usePersistentState("mvc.Pb", 3); // Brine discharge pump pressure (bar)
  const [Pd, setPd] = usePersistentState("mvc.Pd", 3); // Product pump pressure (bar)
  const [VC, setVC] = usePersistentState("mvc.VC", 383); // Vapor compressor capacity (m³/s)
  const [Pvc, setPvc] = usePersistentState("mvc.Pvc", 1500); // Vapor compressor power (kW)
  const [SEC, setSEC] = usePersistentState("mvc.SEC", 30); // Specific compression exergy (MJ/t)
  const [ELC, setELC] = usePersistentState("mvc.ELC", 0.7); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("mvc.Danti", 2.5); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("mvc.Dacid", 1.0); // Acid chemical dosing rate (L/h)
  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("mvc.pV", 7.5); // Feed water pH
  const [Ts, setTs] = usePersistentState("mvc.Ts", 80); // Steam temperature (°C)
  const [Te, setTe] = usePersistentState("mvc.Te", 65); // Effect temperature (°C)
  const [T0, setT0] = usePersistentState("mvc.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("mvc.S0", 40); // Feed water salinity (g/L)
  const [Y, setY] = usePersistentState("mvc.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("mvc.LF", 0.9); // Load factor
  const [r, setR] = usePersistentState("mvc.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  // CAPEX Cost Factors
  const [Cef, setCef] = usePersistentState("mvc.Cef", 5000); // Effect installation cost factor ($/effect)
  const [Caa, setCaa] = usePersistentState("mvc.Caa", 300); // Effect area cost factor ($/m²)
  const [Cab, setCab] = usePersistentState("mvc.Cab", 200); // Heat exchanger area cost factor ($/m²)
  const [Cvc, setCvc] = usePersistentState("mvc.Cvc", 500); // VC cost factor ($/(m³/s))
  const [Cp0, setCp0] = usePersistentState("mvc.Cp0", 5); // Intake pump cost factor ($/(bar·t/h))
  const [Cpf, setCpf] = usePersistentState("mvc.Cpf", 9); // Feed pump cost factor ($/(bar·t/h))
  const [Cpb, setCpb] = usePersistentState("mvc.Cpb", 3); // Brine discharge pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("mvc.Cpd", 3); // Product pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("mvc.Cwt", 30); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("mvc.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Ccivil, setCcivil] = usePersistentState("mvc.Ccivil", 15); // Civil works cost (% of CAPEX_equip)
  const [Cinstr, setCinstr] = usePersistentState("mvc.Cinstr", 8); // Instrumentation cost (% of equipment)
  const [Cinst, setCinst] = usePersistentState("mvc.Cinst", 0.5); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("mvc.Ceng", 0.05); // Engineering cost (% of equipment)
  // OPEX Cost Factors
  const [Csec, setCsec] = usePersistentState("mvc.Csec", 0.022); // Specific compression exergy cost ($/MJ)
  const [Celc, setCelc] = usePersistentState("mvc.Celc", 0.022); // Electricity price ($/MJ)
  const [Canti, setCanti] = usePersistentState("mvc.Canti", 2); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("mvc.Cacid", 10); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("mvc.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("mvc.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("mvc.Cover", 10); // Overhead cost (% of OPEX-total)

  // Reset function
  const resetToDefaults = () => {
    setNef(5);
    setAa(28320);
    setAb(21627);
    setMd(1000);
    setM0(2700);
    setMf(3238);
    setMb(1688);
    setP0(5);
    setPf(3);
    setPb(3);
    setPd(3);
    setVC(383);
    setPvc(1500);
    setSEC(30);
    setELC(0.7);
    setDanti(2.5);
    setDacid(1.0);
    setpV(7.5);
    setTs(80);
    setTe(65);
    setT0(30);
    setS0(40);
    setY(25);
    setLF(0.9);
    setR(0.06);
    setCef(5000);
    setCaa(300);
    setCab(200);
    setCvc(500);
    setCp0(5);
    setCpf(9);
    setCpb(3);
    setCpd(3);
    setCwt(30);
    setCintake(50);
    setCcivil(15);
    setCinstr(8);
    setCinst(0.5);
    setCeng(0.05);
    setCsec(0.022);
    setCelc(0.022);
    setCanti(2);
    setCacid(10);
    setClabor(0.05);
    setCmain(2);
    setCover(10);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;
  
  // CAPEX Calculations
  // Effect installation cost
  const CAPEX_ef = Nef * Cef;
  // Area costs
  const CAPEX_area = Nef * Aa * Caa + Ab * Cab;
  // VC CAPEX
  const CAPEX_vc = VC * Cvc;
  // Pump CAPEX with size effect (0.8 exponent)
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8);
  const CAPEX_pump_f = Cpf * Math.pow(Pf * Mf, 0.8);
  const CAPEX_pump_b = Cpb * Math.pow(Pb * Mb, 0.8);
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Md, 0.8);
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_f + CAPEX_pump_b + CAPEX_pump_d;
  // Water treatment CAPEX
  const CAPEX_wt = M0 * Cwt;
  // Intake structure CAPEX
  const CAPEX_intake = M0 * Cintake;
  // Equipment total
  const CAPEX_equip = CAPEX_area + CAPEX_vc + CAPEX_Pump + CAPEX_wt + CAPEX_intake;
  // Civil works CAPEX
  const CAPEX_civil = (Ccivil / 100) * CAPEX_equip;
  // Instrumentation, Installation and engineering
  const CAPEX_instr = (Cinstr / 100) * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
  // Total CAPEX
  const CAPEX_total = CAPEX_equip + CAPEX_civil + CAPEX_instr + CAPEX_inst + CAPEX_eng;
  
  // CRF and annualized capital cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const Ucap = (CAPEX_total * CRF) / annualProduction;
  const CAPX_spec = CAPEX_total / Md;

  // OPEX Calculations
  const OPEX_sec = SEC * Csec; // Compression exergy cost ($/t)
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
  { symbol: "Nef", value: fmt(Nef), unit: "#" },

  { symbol: "Aa", value: fmt(Aa), unit: "m²" },
  { symbol: "Ab", value: fmt(Ab), unit: "m²" },

  { symbol: "Md", value: fmt(Md), unit: "t/h" },
  { symbol: "M0", value: fmt(M0), unit: "t/h" },
  { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
  { symbol: "Mb", value: fmt(Mb), unit: "t/h" },

  { symbol: "P0", value: fmt(P0), unit: "bar" },
  { symbol: "Pf", value: fmt(Pf), unit: "bar" },
  { symbol: "Pb", value: fmt(Pb), unit: "bar" },
  { symbol: "Pd", value: fmt(Pd), unit: "bar" },

  { symbol: "VC", value: fmt(VC), unit: "m³/s" },
  { symbol: "Pvc", value: fmt(Pvc), unit: "kW" },

  { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
  { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },

  { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
  { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },

  { symbol: "pV", value: fmt(pV), unit: "-" },

  { symbol: "Ts", value: fmt(Ts), unit: "°C" },
  { symbol: "Te", value: fmt(Te), unit: "°C" },
  { symbol: "T0", value: fmt(T0), unit: "°C" },

  { symbol: "S0", value: fmt(S0), unit: "g/L" },
];

  const FactorsData = [
  { symbol: "Y", value: fmt(Y), unit: "yr" },
  { symbol: "LF", value: fmt(LF), unit: "-" },
  { symbol: "r", value: fmt(r), unit: "-" },

  { symbol: "Cef", value: fmt(Cef), unit: "$/effect" },
  { symbol: "Caa", value: fmt(Caa), unit: "$/m²" },
  { symbol: "Cab", value: fmt(Cab), unit: "$/m²" },

  { symbol: "Cvc", value: fmt(Cvc), unit: "$/(m³/s)" },

  { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
  { symbol: "Cpf", value: fmt(Cpf), unit: "$/(bar·t/h)" },
  { symbol: "Cpb", value: fmt(Cpb), unit: "$/(bar·t/h)" },
  { symbol: "Cpd", value: fmt(Cpd), unit: "$/(bar·t/h)" },

  { symbol: "Cwt", value: fmt(Cwt), unit: "$/(t/h)" },
  { symbol: "Cintake", value: fmt(Cintake), unit: "$/(t/h)" },

  { symbol: "Ccivil", value: fmt(Ccivil), unit: "%" },
  { symbol: "Cinstr", value: fmt(Cinstr), unit: "%" },
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
  { symbol: "CAPEX_ef", value: fmt(CAPEX_ef), unit: "$" },
  { symbol: "CAPEX_area", value: fmt(CAPEX_area), unit: "$" },
  { symbol: "CAPEX_vc", value: fmt(CAPEX_vc), unit: "$" },
  { symbol: "CAPEX_Pump", value: fmt(CAPEX_Pump), unit: "$" },
  { symbol: "CAPEX_wt", value: fmt(CAPEX_wt), unit: "$" },
  { symbol: "CAPEX_intake", value: fmt(CAPEX_intake), unit: "$" },
  { symbol: "CAPEX_equip", value: fmt(CAPEX_equip), unit: "$" },
  { symbol: "CAPEX_civil", value: fmt(CAPEX_civil), unit: "$" },
  { symbol: "CAPEX_instr", value: fmt(CAPEX_instr), unit: "$" },
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
  
  
    const exportPDF = () => {
      const doc = new jsPDF();
    
      // 🔹 عنوان رئيسي
      doc.setFontSize(16);
      doc.text("MVC Water Cost", 10, 15);
    
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
      doc.save("MVC_Water_Cost.pdf");
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
      XLSX.writeFile(wb, "MVC_Water_Cost.xlsx");
    };
  
        return (
          <div className="max-w-6xl mx-auto w-full space-y-3 my-5">
  
            <Section title="MVC Water Cost">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ================= COLUMN 1 ================= */}
                <div>
                  <div className="text-sm font-semibold text-gray-400 mb-2">
                    Inputs
                  </div>
                    <RowInput label="Nef" unit="#" value={Nef} onChange={setNef} info={INFO} />
                    <RowInput label="Aa" unit="m²" value={Aa} onChange={setAa} info={INFO} />
                    <RowInput label="Ab" unit="m²" value={Ab} onChange={setAb} info={INFO} />

                    <RowInput label="Md" unit="t/h" value={Md} onChange={setMd} info={INFO} />
                    <RowInput label="M0" unit="t/h" value={M0} onChange={setM0} info={INFO} />
                    <RowInput label="Mf" unit="t/h" value={Mf} onChange={setMf} info={INFO} />
                    <RowInput label="Mb" unit="t/h" value={Mb} onChange={setMb} info={INFO} />

                    <RowInput label="P0" unit="bar" value={P0} onChange={setP0} info={INFO} />
                    <RowInput label="Pf" unit="bar" value={Pf} onChange={setPf} info={INFO} />
                    <RowInput label="Pb" unit="bar" value={Pb} onChange={setPb} info={INFO} />
                    <RowInput label="Pd" unit="bar" value={Pd} onChange={setPd} info={INFO} />

                    <RowInput label="VC" unit="m³/s" value={VC} onChange={setVC} info={INFO} />
                    <RowInput label="Pvc" unit="kW" value={Pvc} onChange={setPvc} info={INFO} />

                    <RowInput label="SEC" unit="MJ/t" value={SEC} onChange={setSEC} info={INFO} />
                    <RowInput label="ELC" unit="MJ/t" value={ELC} onChange={setELC} info={INFO} />

                    <RowInput label="Danti" unit="L/h" value={Danti} onChange={setDanti} info={INFO} />
                    <RowInput label="Dacid" unit="L/h" value={Dacid} onChange={setDacid} info={INFO} />

                    <RowInput label="pV" unit="-" value={pV} onChange={setpV} info={INFO} />

                    <RowInput label="Ts" unit="°C" value={Ts} onChange={setTs} info={INFO} />
                    <RowInput label="Te" unit="°C" value={Te} onChange={setTe} info={INFO} />
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

                    <RowInput label="Cef" unit="$/effect" value={Cef} onChange={setCef} info={INFO} />
                    <RowInput label="Caa" unit="$/m²" value={Caa} onChange={setCaa} info={INFO} />
                    <RowInput label="Cab" unit="$/m²" value={Cab} onChange={setCab} info={INFO} />

                    <RowInput label="Cvc" unit="$/(m³/s)" value={Cvc} onChange={setCvc} info={INFO} />

                    <RowInput label="Cp0" unit="$/(bar·t/h)" value={Cp0} onChange={setCp0} info={INFO} />
                    <RowInput label="Cpf" unit="$/(bar·t/h)" value={Cpf} onChange={setCpf} info={INFO} />
                    <RowInput label="Cpb" unit="$/(bar·t/h)" value={Cpb} onChange={setCpb} info={INFO} />
                    <RowInput label="Cpd" unit="$/(bar·t/h)" value={Cpd} onChange={setCpd} info={INFO} />

                    <RowInput label="Cwt" unit="$/(t/h)" value={Cwt} onChange={setCwt} info={INFO} />
                    <RowInput label="Cintake" unit="$/(t/h)" value={Cintake} onChange={setCintake} info={INFO} />

                    <RowInput label="Ccivil" unit="%" value={Ccivil} onChange={setCcivil} info={INFO} />
                    <RowInput label="Cinstr" unit="%" value={Cinstr} onChange={setCinstr} info={INFO} />
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
                  <RowView label="CAPEX_ef" value={fmt(CAPEX_ef)} unit="$" info={INFO} />
                <RowView label="CAPEX_area" value={fmt(CAPEX_area)} unit="$" info={INFO} />
                <RowView label="CAPEX_vc" value={fmt(CAPEX_vc)} unit="$" info={INFO} />
                <RowView label="CAPEX_Pump" value={fmt(CAPEX_Pump)} unit="$" info={INFO} />
                <RowView label="CAPEX_wt" value={fmt(CAPEX_wt)} unit="$" info={INFO} />
                <RowView label="CAPEX_intake" value={fmt(CAPEX_intake)} unit="$" info={INFO} />
                <RowView label="CAPEX_equip" value={fmt(CAPEX_equip)} unit="$" info={INFO} />
                <RowView label="CAPEX_civil" value={fmt(CAPEX_civil)} unit="$" info={INFO} />
                <RowView label="CAPEX_instr" value={fmt(CAPEX_instr)} unit="$" info={INFO} />
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
