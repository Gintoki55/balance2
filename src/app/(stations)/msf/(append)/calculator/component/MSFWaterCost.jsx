
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
  Nst1: "Number of stages in first section",
  Nst2: "Number of stages in second section",
  Nst3: "Number of stages in third section",

  Aa: "Area of brine heater",
  Ab: "Area of each stage in the first section",
  Ac: "Area of each stage in the second section",
  Ad: "Area of each stage in the third section",

  Md: "Product water capacity",
  M0: "Raw feed water",
  Mf: "Feed water flow",
  Mr: "Recirculating brine flow",

  P0: "Intake pump pressure",
  Pr: "Recirculation pump pressure",
  Pd: "Discharge pump pressure",

  VC: "Vapor compressor capacity",
  AZ: "Absorber capacity",

  SEC: "Specific steam exergy",
  ELC: "Electricity consumption",

  Danti: "Antiscalant chemical dosing rate",
  Dacid: "Acid chemical dosing rate",

  pV: "Feed water pH",

  Th: "Brine heater temperature",
  Tb: "Brine blowdown temperature",
  T0: "Feed water temperature",

  S0: "Feed water salinity",
   Y: "Life span",
  LF: "Load factor",
  r: "Discount rate",

  Caa: "Heat transfer area cost section A",
  Cab: "Heat transfer area cost section B",
  Cac: "Heat transfer area cost section C",
  Cad: "Heat transfer area cost section D",

  Cp0: "Intake pump cost factor",
  Cpr: "Recirculation pump cost factor",
  Cpd: "Discharge pump cost factor",

  Cvc: "Vapor compressor capacity factor",
  Caz: "Absorber capacity factor",

  Cwt: "Water pretreatment and posttreatment cost factor",
  Cintake: "Intake structure cost factor",

  Ccivil: "Civil works cost % of CAPEX_equip",
  Cinstr: "Instrumentation cost % of equipment",
  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Csec: "Steam exergy cost",
  Celc: "Electricity price",

  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",

  Clabor: "Labor cost factor",
  Cmain: "Annual maintenance cost as percentage of total CAPEX",
  Cover: "Overhead cost % of OPEX-total",
  CAPEX_area: "Cost of heat transfer areas",
  CAPEX_Pump: "Pump CAPEX",
  CAPEX_wt: "Water treatment CAPEX",
  CAPEX_intake: "Intake structure CAPEX",
  CAPEX_vc: "Vapor compressor CAPEX",
  CAPEX_az: "Absorber CAPEX",

  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works CAPEX",
  CAPEX_instr: "Instrumentation cost",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",

  CAPEX_total: "Total CAPEX",
  CAPEX_spec: "Specific CAPEX per unit capacity",

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
   "#": "Dimensionless",
  "m²": "Square meters",
  "t/h": "Metric tons per hour",
  bar: "Bar",
  "m³/s": "Cubic meters per second",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",
  "-": "Dimensionless",

  yr: "Years",
  "-": "Dimensionless",

  "$/m²": "Dollars per square meter",

  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(m³/s)": "Dollars per m³/s",
  "$/(t/h)": "Dollars per t/h",

  "%": "Percent of equipment cost",
  "%/yr": "Percent per year",

  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",

  "$/t": "Dollars per metric ton",
  "$": "Dollars",

  "$/(t/h)": "Dollars per t/h",
  "$/t": "Dollars per metric ton",

  "-": "Dimensionless"
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


export default function MSFWaterCost(){

    // Group 1: Simulator Inputs
  const [Nst1, setNst1] = usePersistentState("msf.Nst1", 10); // Number of stages in first section
  const [Nst2, setNst2] = usePersistentState("msf.Nst2", 6); // Number of stages in second section
  const [Nst3, setNst3] = usePersistentState("msf.Nst3", 4); // Number of stages in third section
  const [Aa, setAa] = usePersistentState("msf.Aa", 2000); // Area of brine heater (m²)
  const [Ab, setAb] = usePersistentState("msf.Ab", 1500); // Area of each stage in the first section (m²)
  const [Ac, setAc] = usePersistentState("msf.Ac", 1000); // Area of each stage in the second section (m²)
  const [Ad, setAd] = usePersistentState("msf.Ad", 500); // Area of each stage in the third section (m²)
  const [Md, setMd] = usePersistentState("msf.Md", 2100); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("msf.M0", 2300); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("msf.Mf", 4000); // Feed water flow (t/h)
  const [Mr, setMr] = usePersistentState("msf.Mr", 3500); // Recirculating brine flow (t/h)
  const [P0, setP0] = usePersistentState("msf.P0", 2); // Intake pump pressure (bar)
  const [Pr, setPr] = usePersistentState("msf.Pr", 3); // Recirculation pump pressure (bar)
  const [Pd, setPd] = usePersistentState("msf.Pd", 2.5); // Discharge pump pressure (bar)
  const [Ptvc, setPtvc] = usePersistentState("msf.Ptvc", 0); // TVC compressor power (kW), set to 0 for standard MSF
  const [Mss, setMss] = usePersistentState("msf.Mss", 0); // Motive steam flow (t/h), set to 0 for standard MSF
  const [VC, setVC] = usePersistentState("msf.VC", 0); // Vapor compressor capacity (m³/s), set to 0 for standard MSF
  const [AZ, setAZ] = usePersistentState("msf.AZ", 0); // Absorber capacity (m³/s), set to 0 for standard MSF
  const [SEC, setSEC] = usePersistentState("msf.SEC", 120); // Specific steam exergy (MJ/t)
  const [ELC, setELC] = usePersistentState("msf.ELC", 3.5); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("msf.Danti", 2.5); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("msf.Dacid", 1.0); // Acid chemical dosing rate (L/h)
  const [Y, setY] = usePersistentState("msf.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("msf.LF", 0.90); // Load factor
  const [r, setR] = usePersistentState("msf.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  const [Cstg, setCstg] = usePersistentState("msf.Cstg", 8000); // Stage cost factor ($/(t/h))
  const [Caa, setCaa] = usePersistentState("msf.Caa", 150); // Heat transfer area cost section A ($/m²)
    const [Cab, setCab] = usePersistentState("msf.Cab", 140); // Heat transfer area cost section B ($/m²)
    const [Cac, setCac] = usePersistentState("msf.Cac", 130); // Heat transfer area cost section C ($/m²)
    const [Cad, setCad] = usePersistentState("msf.Cad", 120); // Heat transfer area cost section D ($/m²)
  const [Cp0, setCp0] = usePersistentState("msf.Cp0", 8); // Intake pump cost factor ($/(bar·t/h))
  const [Cpr, setCpr] = usePersistentState("msf.Cpr", 12); // Recirculation pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("msf.Cpd", 10); // Discharge pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("msf.Cwt", 100); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("msf.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Csec, setCsec] = usePersistentState("msf.Csec", 0.02); // Steam exergy price ($/MJ)
  const [Celc, setCelc] = usePersistentState("msf.Celc", 0.022); // Electricity price ($/MJ)
  const [Cvc, setCvc] = usePersistentState("msf.Cvc", 0); // VC cost factor ($/(m³/s)), set to 0 for standard MSF
  const [Caz, setCaz] = usePersistentState("msf.Caz", 0); // Absorber capacity factor ($/(m³/s)), set to 0 for standard MSF

  const [Canti, setCanti] = usePersistentState("msf.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("msf.Cacid", 0.3); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("msf.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("msf.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("msf.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cinstr, setCinstr] = usePersistentState("msf.Cinstr", 10); // Instrumentation cost (% of equipment)
  const [Cinst, setCinst] = usePersistentState("msf.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("msf.Ceng", 8); // Engineering cost (% of equipment)
  const [Ccivil, setCcivil] = usePersistentState("msf.Ccivil", 5); // Civil works cost (% of CAPEX_equip)

  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("msf.pV", 7.5); // Feed water pH
  const [Th, setTh] = usePersistentState("msf.Th", 115); // Brine heater temperature (°C)
  const [Tb, setTb] = usePersistentState("msf.Tb", 40); // Brine blowdown temperature (°C)
  const [T0, setT0] = usePersistentState("msf.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("msf.S0", 40); // Feed water salinity (g/L)

  // Reset function
  const resetToDefaults = () => {
    setNst1(10);
    setNst2(6);
    setNst3(4);
    setAa(2000);
    setAb(1500);
    setAc(1000);
    setAd(500);
    setMd(2100);
    setM0(2300);
    setMf(4000);
    setMr(3500);
    setP0(2);
    setPr(3);
    setPd(2.5);
    setPtvc(0);
    setMss(0);
    setVC(0);
    setAZ(0);
    setSEC(120);
    setELC(3.5);
    setDanti(2.5);
    setDacid(1.0);
    setY(25);
    setLF(0.90);
    setR(0.06);
    setCstg(8000);
    setCaa(150);
    setCab(140);
    setCac(130);
    setCad(120);
    setCp0(8);
    setCpr(12);
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
    setCinstr(10);
    setCinst(15);
    setCeng(8);
    setCcivil(5);
    setpV(7.5);
    setTh(115);
    setTb(40);
    setT0(30);
    setS0(40);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;
  const Nst = Nst1 + Nst2 + Nst3;
  
  // CAPEX Calculations
  // Heat transfer area costs (all areas combined)
  const CAPEX_area = Aa * Caa + Nst1 * Ab * Cab + Nst2 * Ac * Cac + Nst3 * Ad * Cad;
  // Pump CAPEX with size effect (0.8 exponent)
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8);
  const CAPEX_pump_r = Cpr * Math.pow(Pr * Mr, 0.8);
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Mf, 0.8);
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_r + CAPEX_pump_d;
  // Water treatment CAPEX
  const CAPEX_wt = M0 * Cwt;
  // Intake structure CAPEX
  const CAPEX_intake = M0 * Cintake;
  // VC CAPEX (for TVC mode)
  const CAPEX_vc = VC * Cvc;
  // Absorber CAPEX
  const CAPEX_az = AZ * Caz;
  // Equipment total (before civil)
  const CAPEX_equip = CAPEX_area + CAPEX_Pump + CAPEX_wt + CAPEX_intake + CAPEX_vc + CAPEX_az;
  // Civil works CAPEX
  const CAPEX_civil = (Ccivil / 100) * CAPEX_equip;
  // Instrumentation, installation and engineering
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
  { symbol: "Nst1", value: fmt(Nst1), unit: "#" },
  { symbol: "Nst2", value: fmt(Nst2), unit: "#" },
  { symbol: "Nst3", value: fmt(Nst3), unit: "#" },

  { symbol: "Aa", value: fmt(Aa), unit: "m²" },
  { symbol: "Ab", value: fmt(Ab), unit: "m²" },
  { symbol: "Ac", value: fmt(Ac), unit: "m²" },
  { symbol: "Ad", value: fmt(Ad), unit: "m²" },

  { symbol: "Md", value: fmt(Md), unit: "t/h" },
  { symbol: "M0", value: fmt(M0), unit: "t/h" },
  { symbol: "Mf", value: fmt(Mf), unit: "t/h" },
  { symbol: "Mr", value: fmt(Mr), unit: "t/h" },

  { symbol: "P0", value: fmt(P0), unit: "bar" },
  { symbol: "Pr", value: fmt(Pr), unit: "bar" },
  { symbol: "Pd", value: fmt(Pd), unit: "bar" },

  { symbol: "VC", value: fmt(VC), unit: "m³/s" },
  { symbol: "AZ", value: fmt(AZ), unit: "m³/s" },

  { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
  { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },

  { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
  { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },

  { symbol: "pV", value: fmt(pV), unit: "-" },

  { symbol: "Th", value: fmt(Th), unit: "°C" },
  { symbol: "Tb", value: fmt(Tb), unit: "°C" },
  { symbol: "T0", value: fmt(T0), unit: "°C" },

  { symbol: "S0", value: fmt(S0), unit: "g/L" }
];

const FactorsData = [
  { symbol: "Y", value: fmt(Y), unit: "yr" },
  { symbol: "LF", value: fmt(LF), unit: "-" },
  { symbol: "r", value: fmt(r), unit: "-" },

  { symbol: "Caa", value: fmt(Caa), unit: "$/m²" },
  { symbol: "Cab", value: fmt(Cab), unit: "$/m²" },
  { symbol: "Cac", value: fmt(Cac), unit: "$/m²" },
  { symbol: "Cad", value: fmt(Cad), unit: "$/m²" },

  { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
  { symbol: "Cpr", value: fmt(Cpr), unit: "$/(bar·t/h)" },
  { symbol: "Cpd", value: fmt(Cpd), unit: "$/(bar·t/h)" },

  { symbol: "Cvc", value: fmt(Cvc), unit: "$/(m³/s)" },
  { symbol: "Caz", value: fmt(Caz), unit: "$/(m³/s)" },

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
  { symbol: "Cover", value: fmt(Cover), unit: "%" }
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
  { symbol: "CAPEX_instr", value: fmt(CAPEX_instr), unit: "$" },
  { symbol: "CAPEX_inst", value: fmt(CAPEX_inst), unit: "$" },
  { symbol: "CAPEX_eng", value: fmt(CAPEX_eng), unit: "$" },

  { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
  { symbol: "CAPEX_spec", value: fmt(CAPX_spec), unit: "$/(t/h)" },

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
    doc.text("MSF Water Cost", 10, 15);
  
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
    doc.save("MSF_Water_Cost.pdf");
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
    XLSX.writeFile(wb, "MSF_Water_Cost.xlsx");
  };

      return (
        <div className="max-w-6xl mx-auto w-full space-y-3 my-5">

          <Section title="MSF Water Cost">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ================= COLUMN 1 ================= */}
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-2">
                  Inputs
                </div>
                <RowInput label="Nst1" unit="#" value={Nst1} onChange={setNst1} info={INFO} />
                <RowInput label="Nst2" unit="#" value={Nst2} onChange={setNst2} info={INFO} />
                <RowInput label="Nst3" unit="#" value={Nst3} onChange={setNst3} info={INFO} />

                <RowInput label="Aa" unit="m²" value={Aa} onChange={setAa} info={INFO} />
                <RowInput label="Ab" unit="m²" value={Ab} onChange={setAb} info={INFO} />
                <RowInput label="Ac" unit="m²" value={Ac} onChange={setAc} info={INFO} />
                <RowInput label="Ad" unit="m²" value={Ad} onChange={setAd} info={INFO} />

                <RowInput label="Md" unit="t/h" value={Md} onChange={setMd} info={INFO} />
                <RowInput label="M0" unit="t/h" value={M0} onChange={setM0} info={INFO} />
                <RowInput label="Mf" unit="t/h" value={Mf} onChange={setMf} info={INFO} />
                <RowInput label="Mr" unit="t/h" value={Mr} onChange={setMr} info={INFO} />

                <RowInput label="P0" unit="bar" value={P0} onChange={setP0} info={INFO} />
                <RowInput label="Pr" unit="bar" value={Pr} onChange={setPr} info={INFO} />
                <RowInput label="Pd" unit="bar" value={Pd} onChange={setPd} info={INFO} />

                <RowInput label="VC" unit="m³/s" value={VC} onChange={setVC} info={INFO} />
                <RowInput label="AZ" unit="m³/s" value={AZ} onChange={setAZ} info={INFO} />

                <RowInput label="SEC" unit="MJ/t" value={SEC} onChange={setSEC} info={INFO} />
                <RowInput label="ELC" unit="MJ/t" value={ELC} onChange={setELC} info={INFO} />

                <RowInput label="Danti" unit="L/h" value={Danti} onChange={setDanti} info={INFO} />
                <RowInput label="Dacid" unit="L/h" value={Dacid} onChange={setDacid} info={INFO} />

                <RowInput label="pV" unit="-" value={pV} onChange={setpV} info={INFO} />

                <RowInput label="Th" unit="°C" value={Th} onChange={setTh} info={INFO} />
                <RowInput label="Tb" unit="°C" value={Tb} onChange={setTb} info={INFO} />
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

                <RowInput label="Cp0" unit="$/(bar·t/h)" value={Cp0} onChange={setCp0} info={INFO} />
                <RowInput label="Cpr" unit="$/(bar·t/h)" value={Cpr} onChange={setCpr} info={INFO} />
                <RowInput label="Cpd" unit="$/(bar·t/h)" value={Cpd} onChange={setCpd} info={INFO} />

                <RowInput label="Cvc" unit="$/(m³/s)" value={Cvc} onChange={setCvc} info={INFO} />
                <RowInput label="Caz" unit="$/(m³/s)" value={Caz} onChange={setCaz} info={INFO} />

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
                <RowView label="CAPEX_area" value={fmt(CAPEX_area)} unit="$" info={INFO} />
                <RowView label="CAPEX_Pump" value={fmt(CAPEX_Pump)} unit="$" info={INFO} />
                <RowView label="CAPEX_wt" value={fmt(CAPEX_wt)} unit="$" info={INFO} />
                <RowView label="CAPEX_intake" value={fmt(CAPEX_intake)} unit="$" info={INFO} />
                <RowView label="CAPEX_vc" value={fmt(CAPEX_vc)} unit="$" info={INFO} />
                <RowView label="CAPEX_az" value={fmt(CAPEX_az)} unit="$" info={INFO} />

                <RowView label="CAPEX_equip" value={fmt(CAPEX_equip)} unit="$" info={INFO} />
                <RowView label="CAPEX_civil" value={fmt(CAPEX_civil)} unit="$" info={INFO} />
                <RowView label="CAPEX_instr" value={fmt(CAPEX_instr)} unit="$" info={INFO} />
                <RowView label="CAPEX_inst" value={fmt(CAPEX_inst)} unit="$" info={INFO} />
                <RowView label="CAPEX_eng" value={fmt(CAPEX_eng)} unit="$" info={INFO} />

                <RowView label="CAPEX_total" value={fmt(CAPEX_total)} unit="$" info={INFO} />
                <RowView label="CAPEX_spec" value={fmt(CAPX_spec)} unit="$/(t/h)" info={INFO} />

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
        <Thermometer className="w-4 h-4" />
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
