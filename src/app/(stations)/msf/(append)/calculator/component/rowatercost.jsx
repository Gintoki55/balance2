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
  Na: "Number of trains in first pass",
  Nc: "Number of trains in second pass",

  PV1: "Number of pressure vessels in first stage",
  PV2: "Number of pressure vessels in second stage",
  PV3: "Number of pressure vessels in third stage",
  PV4: "Number of pressure vessels in fourth stage",

  Mem1: "Number of elements in each pressure vessel of first stage",
  Mem2: "Number of elements in each pressure vessel of second stage",
  Mem3: "Number of elements in each pressure vessel of third stage",
  Mem4: "Number of elements in each pressure vessel of fourth stage",

  Md: "Product water capacity",
  M0: "Raw feed water",
  Mb: "Brine water",
  Mfa: "First pass feed water",
  Mfc: "Second pass feed water; Mfc=k*Mp",

  Pfa: "First pass pressure",
  "ΔPfb": "Booster pump increment pressure; ΔPfb=BP·Pfb",
  Pfc: "Second pass pressure (0 if single pass)",
  Pf0: "Intake pump pressure",

  SEC: "Specific electricity consumption for main process",
  ELC: "Other electricity consumption",

  Danti: "Antiscalant chemical dosing rate",
  Dacid: "Acid chemical dosing rate",

  pV: "Feed water pH",
  T0: "Feed water temperature",
  S0: "Feed water salinity",
  Sd: "Product water salinity",

  // ===== Units =====
  "#": "Dimensionless",
  "t/h": "Metric tons per hour",
  bar: "Bar",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "-": "Dimensionless",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",

   // ===== Factors =====
  Y: "Plant life span",
  LF: "Annual load factor (availability)",
  r: "Discount rate (interest rate)",

  Cnn: "Cost factor per train",
  Cpv: "Pressure vessel cost factor",

  Cmem1: "Membrane element cost factor first pass",
  Cmem2: "Membrane element cost factor second pass",

  Cpfa: "First pass HP pump cost factor",
  Cpfb: "Booster pump cost factor",
  Cpfc: "Second pass HP pump cost factor",
  Cp0: "Intake pump cost factor",

  Cwt: "Water pretreatment and posttreatment cost factor",
  Cintake: "Intake structure cost factor",

  Ccivil: "Civil works cost % of CAPEX_equip",
  Cinstr: "Instrumentation cost % of equipment",
  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Celc: "Electricity price",
  Rmem: "Membrane replacement rate",

  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",
  Cwash: "Washing chemical cost per element per event",

  W: "Washing events per year",

  Clabor: "Labor cost factor",
  Cfilter: "Cartridge filter replacement cost factor",

  Cmaint: "Maintenance cost rate",
  Cover: "Overhead cost % of OPEX-total",

  // ===== Units =====
  yr: "Years",
  "-": "Dimensionless",
  "$/train": "Dollars per train",
  "$/vessel": "Dollars per vessel",
  "$/elem": "Dollars per element",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(t/h)": "Dollars per t/h",
  "%": "Percent of equipment cost",
  "$/MJ": "Dollars per megajoule",
  "%/yr": "Percent per year",
  "$/L": "Dollars per liter",
  "$/elem/ev": "Dollars per element per event",
  "#/yr": "Events per year",
  "$/t": "Dollars per metric ton",

    // ===== CAPEX =====
  CAPEX_pv: "Pressure vessel cost",
  CAPEX_mem: "Membrane cost",
  CAPEX_pumps: "Total pump cost",
  CAPEX_wt: "Pretreatment and post-treatment system cost",
  CAPEX_intake: "Intake/outfall cost",

  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works cost",
  CAPEX_instr: "Instrumentation cost",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",

  CAPEX_nn: "Multi-train branching cost",
  CAPEX_total: "Total CAPEX",
  CAPEX_spec: "Specific CAPEX",

  CRF: "Capital recovery factor",
  Ucap: "Annualized capital cost",

  // ===== OPEX =====
  OPEX_sec: "Specific exergy consumption cost",
  OPEX_elc: "Other electricity cost",
  OPEX_mem: "Membrane replacement cost",
  OPEX_anti: "Antiscalant cost",
  OPEX_acid: "Acid dosing cost",
  OPEX_wash: "Washing chemicals cost",

  OPEX_labor: "Labor cost",
  OPEX_filter: "Cartridge filter replacement cost",
  OPEX_maint: "Maintenance cost",
  OPEX_over: "Overhead cost",

  OPEX_total: "Total OPEX with overhead",
  UPC: "Unit Production Cost",

  // ===== Units =====
  "$": "Dollars",
  "$/(t/h)": "Dollars per t/h",
  "-": "Dimensionless",
  "$/t": "Dollars per metric ton",

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

export default function ROWaterCost() {
  const [Md, setMd] = usePersistentState("ro.Md", 1000);
  const [M0, setM0] = usePersistentState("ro.M0", 2000);
  const [Na, setNa] = usePersistentState("ro.Na", 2);
  const [Nc, setNc] = usePersistentState("ro.Nc", 1);

  const [PV1, setPV1] = usePersistentState("ro.PV1", 110);
  const [PV2, setPV2] = usePersistentState("ro.PV2", 77);
  const [PV3, setPV3] = usePersistentState("ro.PV3", 72);
  const [PV4, setPV4] = usePersistentState("ro.PV4", 31);

  const [Mem1, setMem1] = usePersistentState("ro.Mem1", 7);
  const [Mem2, setMem2] = usePersistentState("ro.Mem2", 7);
  const [Mem3, setMem3] = usePersistentState("ro.Mem3", 7);
  const [Mem4, setMem4] = usePersistentState("ro.Mem4", 7);

  const [Mfa, setMfa] = usePersistentState("ro.Mfa", 2000);
  const [Mfc, setMfc] = usePersistentState("ro.Mfc", 720);

  const [Pfa, setPfa] = usePersistentState("ro.Pfa", 48.5);
  const [Mb, setMb] = usePersistentState("ro.Mb", 1000);
  const [Pfb, setPfb] = usePersistentState("ro.Pfb", 18);
  const [Pfc, setPfc] = usePersistentState("ro.Pfc", 10.5);
  const [Pf0, setPf0] = usePersistentState("ro.Pf0", 5);

  const [SEC, setSEC] = usePersistentState("ro.SEC", 12.7);
  const [ELC, setELC] = usePersistentState("ro.ELC", 0.7);

  const [Danti, setDanti] = usePersistentState("ro.Danti", 2);
  const [Dacid, setDacid] = usePersistentState("ro.Dacid", 2);

  const [pV, setpV] = usePersistentState("ro.pV", 7.5);
  const [T0, setT0] = usePersistentState("ro.T0", 30);
  const [S0, setS0] = usePersistentState("ro.S0", 40);
  const [Sd, setSd] = usePersistentState("ro.Sd", 0.2);

  // section 2
  const [Y, setY] = usePersistentState("ro.Y", 25);
  const [LF, setLF] = usePersistentState("ro.LF", 0.9);
  const [r, setr] = usePersistentState("ro.r", 0.06);
  const [Cnn, setCnn] = usePersistentState("ro.Cnn", 50000);
  const [Cpv, setCpv] = usePersistentState("ro.Cpv", 800);
  const [Cmem1, setCmem1] = usePersistentState("ro.Cmem1", 600);
  const [Cmem2, setCmem2] = usePersistentState("ro.Cmem2", 500);
  const [Cpfa, setCpfa] = usePersistentState("ro.Cpfa", 250);
  const [Cpfb, setCpfb] = usePersistentState("ro.Cpfb", 25);
  const [Cpfc, setCpfc] = usePersistentState("ro.Cpfc", 25);
  const [Cp0, setCp0] = usePersistentState("ro.Cp0", 80);
  const [Cwt, setCwt] = usePersistentState("ro.Cwt", 800);
  const [Cintake, setCintake] = usePersistentState("ro.Cintake", 400);
  const [Ccivil, setCcivil] = usePersistentState("ro.Ccivil", 5);
  const [Cinstr, setCinstr] = usePersistentState("ro.Cinstr", 8);
  const [Cinst, setCinst] = usePersistentState("ro.Cinst", 15);
  const [Ceng, setCeng] = usePersistentState("ro.Ceng", 8);
  const [Celc, setCelc] = usePersistentState("ro.Celc", 0.022);
  const [Rmem, setRmem] = usePersistentState("ro.Rmem", 15);
  const [Canti, setCanti] = usePersistentState("ro.Canti", 2);
  const [Cacid, setCacid] = usePersistentState("ro.Cacid", 2);
  const [Cwash, setCwash] = usePersistentState("ro.Cwash", 25);
  const [W, setW] = usePersistentState("ro.W", 4);
  const [Clabor, setClabor] = usePersistentState("ro.Clabor", 0.05);
  const [Cfilter, setCfilter] = usePersistentState("ro.Cfilter", 0.005);
  const [Cmaint, setCmaint] = usePersistentState("ro.Cmaint", 2);
  const [Cover, setCover] = usePersistentState("ro.Cover", 10);

  // Reset function
  const resetToDefaults = () => {
    setMd(1000);
    setM0(2000);
    setNa(2);
    setNc(1);
    setPV1(110);
    setPV2(77);
    setPV3(72);
    setPV4(31);
    setMem1(7);
    setMem2(7);
    setMem3(7);
    setMem4(7);
    setCnn(50000);
    setCpv(800);
    setCmem1(600);
    setCmem2(500);
    setMfa(2000);
    setMfc(720);
    setPfa(48.5);
    setMb(1000);
    setPfb(18);
    setPfc(10.5);
    setPf0(5);
    setCpfa(250);
    setCpfb(25);
    setCpfc(25);
    setCp0(80);
    setCwt(800);
    setDanti(2);
    setDacid(2);
    setSEC(12.7);
    setELC(0.7);
    setCelc(0.022);
    setRmem(15);
    setCanti(2);
    setCacid(2);
    setCwash(25);
    setClabor(0.05);
    setCmaint(2);
    setCover(10);
    setCfilter(0.005);
    setCinstr(8);
    setCinst(15);
    setCeng(8);
    setCintake(400);
    setCcivil(5);
    setpV(7.5);
    setT0(30);
    setS0(40);
    setSd(0.2);
    setY(25);
    setr(0.06);
    setLF(0.9);
    setW(4);
  };

  // مستخدمه في حسابات داخليه
  // === CALCULATIONS ===

  // Total pressure vessels
  const NPV_total = Na * (PV1 + PV2) + Nc * (PV3 + PV4);

  // Total membrane elements by stage
  const Nmem1_total = Na * (PV1 * Mem1 + PV2 * Mem2); // First pass elements
  const Nmem2_total = Nc * (PV3 * Mem3 + PV4 * Mem4); // Second pass elements
  const Nmem = Nmem1_total + Nmem2_total;

  // CAPEX Calculations
  const CAPEX_mem =
    Na * (PV1 * Mem1 + PV2 * Mem2) * Cmem1 +
    Nc * (PV3 * Mem3 + PV4 * Mem4) * Cmem2;
  const CAPEX_pv = (Na * (PV1 + PV2) + Nc * (PV3 + PV4)) * Cpv;
  const CAPEX_membrane_system = CAPEX_mem + CAPEX_pv;

  // Pump CAPEX = cost factor × (pressure × flow)^0.8 (size effect)
  const CAPEX_pump_fa = Cpfa * Math.pow(Pfa * Mfa, 0.8); // First pass HP pump
  const CAPEX_pump_fb = Cpfb * Math.pow(Pfb * Mb, 0.8); // Booster pump
  const CAPEX_pump_fc = Cpfc * Math.pow(Pfc * Mfc, 0.8); // Second pass HP pump (0 if Pfc=0)
  const CAPEX_pump_0 = Cp0 * Math.pow(Pf0 * M0, 0.8); // Intake pump
  const CAPEX_pumps =
    CAPEX_pump_fa + CAPEX_pump_fb + CAPEX_pump_fc + CAPEX_pump_0;

  // Pretreatment CAPEX
  const CAPEX_wt = M0 * Cwt;

  // Infrastructure CAPEX
  const CAPEX_intake_struct = M0 * Cintake;
  const CAPEX_instrument =
    (Cinstr / 100) * (CAPEX_membrane_system + CAPEX_pumps);
  const CAPEX_equipment =
    CAPEX_membrane_system + CAPEX_pumps + CAPEX_wt + CAPEX_intake_struct;
  const CAPEX_equip = CAPEX_equipment; // Alias for consistency with other tables
  // Civil cost as % of equipment (consistent with other tables)
  const CAPEX_civil = (Ccivil / 100) * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equipment;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equipment;
  const CAPEX_nn = (Na + Nc) * Cnn; // Multi-train branching cost based on total number of trains
  const CAPEX_total =
    CAPEX_equipment +
    CAPEX_civil +
    CAPEX_instrument +
    CAPEX_inst +
    CAPEX_eng +
    CAPEX_nn;
  const CAPEX_specific = CAPEX_total / Md;

  // OPEX Calculations
  const Cenergy = SEC * Celc;
  const annualProduction = Md * 8760 * LF;
  const Cmembrane =
    (Nmem1_total * (Rmem / 100) * Cmem1 + Nmem2_total * (Rmem / 100) * Cmem2) /
    annualProduction;

  // Chemical dosing costs: D (L/h) * C ($/L) = $/h, then divide by Md (t/h) = $/t
  const Cantiscalant = (Danti * Canti) / Md; // $/t
  const Cacid_dose = (Dacid * Cacid) / Md; // $/t
  const Cwashing = (Nmem * Cwash * W) / annualProduction;

  const OPEX_sec = SEC * Celc; // Specific energy consumption cost ($/t)
  const OPEX_elc = ELC * Celc; // Other electricity cost ($/t)
  const Cmaint_annual = ((Cmaint / 100) * CAPEX_total) / annualProduction;
  const OPEX_total =
    OPEX_sec +
    OPEX_elc +
    Cmembrane +
    Cantiscalant +
    Cacid_dose +
    Cwashing +
    Clabor +
    Cmaint_annual +
    Cfilter;
  const Cover_annual = (Cover / 100) * OPEX_total;
  const OPEX_total_with_overhead = OPEX_total + Cover_annual;

  // Final Cost
  const CRF = (r * Math.pow(1 + r, Y)) / (Math.pow(1 + r, Y) - 1);
  const annualCAPEX = CAPEX_total * CRF; // Annualized capital cost ($/yr)
  const Ucap = annualCAPEX / annualProduction; // $/t
  const UPC = OPEX_total_with_overhead + Ucap;



const inputData = [
  { symbol: "Na", value: fmt(Na), unit: "#" },
  { symbol: "Nc", value: fmt(Nc), unit: "#" },
  { symbol: "Md", value: fmt(Md), unit: "t/h" },
  { symbol: "M0", value: fmt(M0), unit: "t/h" },
  { symbol: "PV1", value: fmt(PV1), unit: "#" },
  { symbol: "PV2", value: fmt(PV2), unit: "#" },
  { symbol: "PV3", value: fmt(PV3), unit: "#" },
  { symbol: "PV4", value: fmt(PV4), unit: "#" },
  { symbol: "Mem1", value: fmt(Mem1), unit: "#" },
  { symbol: "Mem2", value: fmt(Mem2), unit: "#" },
  { symbol: "Mem3", value: fmt(Mem3), unit: "#" },
  { symbol: "Mem4", value: fmt(Mem4), unit: "#" },
  { symbol: "Mfa", value: fmt(Mfa), unit: "t/h" },
  { symbol: "Mfc", value: fmt(Mfc), unit: "t/h" },
  { symbol: "Pfa", value: fmt(Pfa), unit: "bar" },
  { symbol: "Mb", value: fmt(Mb), unit: "t/h" },
  { symbol: "Pfb", value: fmt(Pfb), unit: "bar" },
  { symbol: "Pfc", value: fmt(Pfc), unit: "bar" },
  { symbol: "Pf0", value: fmt(Pf0), unit: "bar" },
  { symbol: "SEC", value: fmt(SEC), unit: "MJ/t" },
  { symbol: "ELC", value: fmt(ELC), unit: "MJ/t" },
  { symbol: "Danti", value: fmt(Danti), unit: "L/h" },
  { symbol: "Dacid", value: fmt(Dacid), unit: "L/h" },
  { symbol: "pV", value: fmt(pV), unit: "-" },
  { symbol: "T0", value: fmt(T0), unit: "°C" },
  { symbol: "S0", value: fmt(S0), unit: "g/L" },
  { symbol: "Sd", value: fmt(Sd), unit: "g/L" },
];

const FactorsData = [
  { symbol: "Y", value: fmt(Y), unit: "yr" },
  { symbol: "LF", value: fmt(LF), unit: "-" },
  { symbol: "r", value: fmt(r), unit: "-" },
  { symbol: "Cnn", value: fmt(Cnn), unit: "$/train" },
  { symbol: "Cmem1", value: fmt(Cmem1), unit: "$/element" },
  { symbol: "Cmem2", value: fmt(Cmem2), unit: "$/element" },
  { symbol: "Cpv", value: fmt(Cpv), unit: "$/vessel" },
  { symbol: "Cpfa", value: fmt(Cpfa), unit: "$/(bar·t/h)" },
  { symbol: "Cpfb", value: fmt(Cpfb), unit: "$/(bar·t/h)" },
  { symbol: "Cpfc", value: fmt(Cpfc), unit: "$/(bar·t/h)" },
  { symbol: "Cp0", value: fmt(Cp0), unit: "$/(bar·t/h)" },
  { symbol: "Cwt", value: fmt(Cwt), unit: "$/(t/h)" },
  { symbol: "Cintake", value: fmt(Cintake), unit: "$/(t/h)" },
  { symbol: "Ccivil", value: fmt(Ccivil), unit: "%" },
  { symbol: "Cinstr", value: fmt(Cinstr), unit: "%" },
  { symbol: "Cinst", value: fmt(Cinst), unit: "%" },
  { symbol: "Ceng", value: fmt(Ceng), unit: "%" },
  { symbol: "Celc", value: fmt(Celc), unit: "$/MJ" },
  { symbol: "Rmem", value: fmt(Rmem), unit: "%/yr" },
  { symbol: "Canti", value: fmt(Canti), unit: "$/L" },
  { symbol: "Cacid", value: fmt(Cacid), unit: "$/L" },
  { symbol: "Cwash", value: fmt(Cwash), unit: "$/element/event" },
  { symbol: "W", value: fmt(W), unit: "#/yr" },
  { symbol: "Clabor", value: fmt(Clabor), unit: "$/t" },
  { symbol: "Cfilter", value: fmt(Cfilter), unit: "$/t" },
  { symbol: "Cmaint", value: fmt(Cmaint), unit: "%/yr" },
  { symbol: "Cover", value: fmt(Cover), unit: "%" },
];

const outputData = [
  { symbol: "CAPEX_mem", value: fmt(CAPEX_mem), unit: "$" },
  { symbol: "CAPEX_pv", value: fmt(CAPEX_pv), unit: "$" },
  { symbol: "CAPEX_pumps", value: fmt(CAPEX_pumps), unit: "$" },
  { symbol: "CAPEX_wt", value: fmt(CAPEX_wt), unit: "$" },
  { symbol: "CAPEX_intake", value: fmt(CAPEX_intake_struct), unit: "$" },
  { symbol: "CAPEX_equip", value: fmt(CAPEX_equip), unit: "$" },
  { symbol: "CAPEX_civil", value: fmt(CAPEX_civil), unit: "$" },
  { symbol: "CAPEX_instr", value: fmt(CAPEX_instrument), unit: "$" },
  { symbol: "CAPEX_inst", value: fmt(CAPEX_inst), unit: "$" },
  { symbol: "CAPEX_eng", value: fmt(CAPEX_eng), unit: "$" },
  { symbol: "CAPEX_nn", value: fmt(CAPEX_nn), unit: "$" },
  { symbol: "CAPEX_total", value: fmt(CAPEX_total), unit: "$" },
  { symbol: "CAPEX_spec", value: fmt(CAPEX_specific), unit: "$/(t/h)" },
  { symbol: "CRF", value: fmt(CRF), unit: "-" },
  { symbol: "Ucap", value: fmt(Ucap), unit: "$/t" },
  { symbol: "OPEX_sec", value: fmt(OPEX_sec), unit: "$/t" },
  { symbol: "OPEX_elc", value: fmt(OPEX_elc), unit: "$/t" },
  { symbol: "OPEX_mem", value: fmt(Cmembrane), unit: "$/t" },
  { symbol: "OPEX_anti", value: fmt(Cantiscalant), unit: "$/t" },
  { symbol: "OPEX_acid", value: fmt(Cacid_dose), unit: "$/t" },
  { symbol: "OPEX_wash", value: fmt(Cwashing), unit: "$/t" },
  { symbol: "OPEX_labor", value: fmt(Clabor), unit: "$/t" },
  { symbol: "OPEX_filter", value: fmt(Cfilter), unit: "$/t" },
  { symbol: "OPEX_maint", value: fmt(Cmaint_annual), unit: "$/t" },
  { symbol: "OPEX_over", value: fmt(Cover_annual), unit: "$/t" },
  { symbol: "OPEX_total", value: fmt(OPEX_total_with_overhead), unit: "$/t" },
  { symbol: "UPC", value: fmt(UPC), unit: "$/t" },
];

const exportPDF = () => {
  const doc = new jsPDF();

  // 🔹 عنوان رئيسي
  doc.setFontSize(16);
  doc.text("RO Water Cost", 10, 15);

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
  doc.save("RO_Water_Cost.pdf");
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
  XLSX.writeFile(wb, "RO_Water_Cost.xlsx");
};

  return (
    <div className="max-w-6xl mx-auto w-full space-y-3">
      <div className="text-gray-300 px-4 font-semibold flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        <span className="text-base">Water Cost</span>
      </div>

      <Section title="RO Water Cost">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ================= COLUMN 1 ================= */}
          <div>
            <div className="text-sm font-semibold text-gray-400 mb-2">
              Inputs
            </div>
            <RowInput
              label="Na"
              unit="#"
              value={Na}
              onChange={setNa}
              info={INFO}
            />

            <RowInput
              label="Nc"
              unit="#"
              value={Nc}
              onChange={setNc}
              info={INFO}
            />

            <RowInput
              label="PV1"
              unit="#"
              value={PV1}
              onChange={setPV1}
              info={INFO}
            />

            <RowInput
              label="PV2"
              unit="#"
              value={PV2}
              onChange={setPV2}
              info={INFO}
            />

            <RowInput
              label="PV3"
              unit="#"
              value={PV3}
              onChange={setPV3}
              info={INFO}
            />

            <RowInput
              label="PV4"
              unit="#"
              value={PV4}
              onChange={setPV4}
              info={INFO}
            />

            <RowInput
              label="Mem1"
              unit="#"
              value={Mem1}
              onChange={setMem1}
              info={INFO}
            />

            <RowInput
              label="Mem2"
              unit="#"
              value={Mem2}
              onChange={setMem2}
              info={INFO}
            />

            <RowInput
              label="Mem3"
              unit="#"
              value={Mem3}
              onChange={setMem3}
              info={INFO}
            />

            <RowInput
              label="Mem4"
              unit="#"
              value={Mem4}
              onChange={setMem4}
              info={INFO}
            />

            <RowInput
              label="Md"
              unit="t/h"
              value={Md}
              onChange={setMd}
              info={INFO}
            />

            <RowInput
              label="M0"
              unit="t/h"
              value={M0}
              onChange={setM0}
              info={INFO}
            />

            <RowInput
              label="Mb"
              unit="t/h"
              value={Mb}
              onChange={setMb}
              info={INFO}
            />

            <RowInput
              label="Mfa"
              unit="t/h"
              value={Mfa}
              onChange={setMfa}
              info={INFO}
            />

            <RowInput
              label="Mfc"
              unit="t/h"
              value={Mfc}
              onChange={setMfc}
              info={INFO}
            />

            <RowInput
              label="Pfa"
              unit="bar"
              value={Pfa}
              onChange={setPfa}
              info={INFO}
            />

            <RowInput
              label="ΔPfb"
              unit="bar"
              value={Pfb}
              onChange={setPfb}
              info={INFO}
            />

            <RowInput
              label="Pfc"
              unit="bar"
              value={Pfc}
              onChange={setPfc}
              info={INFO}
            />

            <RowInput
              label="Pf0"
              unit="bar"
              value={Pf0}
              onChange={setPf0}
              info={INFO}
            />

            <RowInput
              label="SEC"
              unit="MJ/t"
              value={SEC}
              onChange={setSEC}
              info={INFO}
            />

            <RowInput
              label="ELC"
              unit="MJ/t"
              value={ELC}
              onChange={setELC}
              info={INFO}
            />

            <RowInput
              label="Danti"
              unit="L/h"
              value={Danti}
              onChange={setDanti}
              info={INFO}
            />

            <RowInput
              label="Dacid"
              unit="L/h"
              value={Dacid}
              onChange={setDacid}
              info={INFO}
            />

            <RowInput
              label="pV"
              unit="-"
              value={pV}
              onChange={setpV}
              info={INFO}
            />

            <RowInput
              label="T0"
              unit="°C"
              value={T0}
              onChange={setT0}
              info={INFO}
            />

            <RowInput
              label="S0"
              unit="g/L"
              value={S0}
              onChange={setS0}
              info={INFO}
            />

            <RowInput
              label="Sd"
              unit="g/L"
              value={Sd}
              onChange={setSd}
              info={INFO}
            />
          </div>

          {/* ================= COLUMN 2 ================= */}
          <div>
            <div className="text-sm font-semibold text-gray-400 mb-2">
              Factors
            </div>
            <RowInput
              label="Y"
              unit="yr"
              value={Y}
              onChange={setY}
              info={INFO}
            />

            <RowInput
              label="LF"
              unit="-"
              value={LF}
              onChange={setLF}
              info={INFO}
            />

            <RowInput
              label="r"
              unit="-"
              value={r}
              onChange={setr}
              info={INFO}
            />

            <RowInput
              label="Cnn"
              unit="$/train"
              value={Cnn}
              onChange={setCnn}
              info={INFO}
            />

            <RowInput
              label="Cpv"
              unit="$/vessel"
              value={Cpv}
              onChange={setCpv}
              info={INFO}
            />

            <RowInput
              label="Cmem1"
              unit="$/elem"
              value={Cmem1}
              onChange={setCmem1}
              info={INFO}
            />

            <RowInput
              label="Cmem2"
              unit="$/elem"
              value={Cmem2}
              onChange={setCmem2}
              info={INFO}
            />

            <RowInput
              label="Cpfa"
              unit="$/(bar·t/h)"
              value={Cpfa}
              onChange={setCpfa}
              info={INFO}
            />

            <RowInput
              label="Cpfb"
              unit="$/(bar·t/h)"
              value={Cpfb}
              onChange={setCpfb}
              info={INFO}
            />

            <RowInput
              label="Cpfc"
              unit="$/(bar·t/h)"
              value={Cpfc}
              onChange={setCpfc}
              info={INFO}
            />

            <RowInput
              label="Cp0"
              unit="$/(bar·t/h)"
              value={Cp0}
              onChange={setCp0}
              info={INFO}
            />

            <RowInput
              label="Cwt"
              unit="$/(t/h)"
              value={Cwt}
              onChange={setCwt}
              info={INFO}
            />

            <RowInput
              label="Cintake"
              unit="$/(t/h)"
              value={Cintake}
              onChange={setCintake}
              info={INFO}
            />

            <RowInput
              label="Ccivil"
              unit="%"
              value={Ccivil}
              onChange={setCcivil}
              info={INFO}
            />

            <RowInput
              label="Cinstr"
              unit="%"
              value={Cinstr}
              onChange={setCinstr}
              info={INFO}
            />

            <RowInput
              label="Cinst"
              unit="%"
              value={Cinst}
              onChange={setCinst}
              info={INFO}
            />

            <RowInput
              label="Ceng"
              unit="%"
              value={Ceng}
              onChange={setCeng}
              info={INFO}
            />

            <RowInput
              label="Celc"
              unit="$/MJ"
              value={Celc}
              onChange={setCelc}
              info={INFO}
            />

            <RowInput
              label="Rmem"
              unit="%"
              value={Rmem}
              onChange={setRmem}
              info={INFO}
            />

            <RowInput
              label="Canti"
              unit="$/L"
              value={Canti}
              onChange={setCanti}
              info={INFO}
            />

            <RowInput
              label="Cacid"
              unit="$/L"
              value={Cacid}
              onChange={setCacid}
              info={INFO}
            />

            <RowInput
              label="Cwash"
              unit="$/elem/ev"
              value={Cwash}
              onChange={setCwash}
              info={INFO}
            />

            <RowInput
              label="W"
              unit="#/yr"
              value={W}
              onChange={setW}
              info={INFO}
            />

            <RowInput
              label="Clabor"
              unit="$/t"
              value={Clabor}
              onChange={setClabor}
              info={INFO}
            />

            <RowInput
              label="Cfilter"
              unit="$/t"
              value={Cfilter}
              onChange={setCfilter}
              info={INFO}
            />

            <RowInput
              label="Cmaint"
              unit="%"
              value={Cmaint}
              onChange={setCmaint}
              info={INFO}
            />

            <RowInput
              label="Cover"
              unit="%"
              value={Cover}
              onChange={setCover}
              info={INFO}
            />
          </div>

          {/* ================= OUTPUTS ================= */}
          <div>
            <div className="text-sm font-semibold text-gray-400 mb-2">
              Outputs
            </div>
            {/* ===== TOP OUTPUTS (CAPEX) ===== */}
            <RowView
              label="CAPEX_pv"
              value={fmt(CAPEX_pv)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_mem"
              value={fmt(CAPEX_mem)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_pumps"
              value={fmt(CAPEX_pumps)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_wt"
              value={fmt(CAPEX_wt)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_intake"
              value={fmt(CAPEX_intake_struct)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_equip"
              value={fmt(CAPEX_equip)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_civil"
              value={fmt(CAPEX_civil)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_instr"
              value={fmt(CAPEX_instrument)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_inst"
              value={fmt(CAPEX_inst)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_eng"
              value={fmt(CAPEX_eng)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_nn"
              value={fmt(CAPEX_nn)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_total"
              value={fmt(CAPEX_total)}
              unit="$"
              info={INFO}
            />
            <RowView
              label="CAPEX_spec"
              value={fmt(CAPEX_specific)}
              unit="$/t"
              info={INFO}
            />
            <RowView label="CRF" value={fmt(CRF)} unit="-" info={INFO} />
            <RowView label="Ucap" value={fmt(Ucap)} unit="$/t" info={INFO} />

            {/* ===== SECOND OUTPUTS (OPEX) ===== */}
            <div className="border-t border-gray-700 mt-4 pt-3">
              <div className="text-sm font-semibold text-gray-400 mb-2">
                Outputs
              </div>
              <RowView
                label="OPEX_sec"
                value={fmt(OPEX_sec)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_elc"
                value={fmt(OPEX_elc)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_mem"
                value={fmt(Cmembrane)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_anti"
                value={fmt(Cantiscalant)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_acid"
                value={fmt(Cacid_dose)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_wash"
                value={fmt(Cwashing)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_labor"
                value={fmt(Clabor)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_filter"
                value={fmt(Cfilter)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_maint"
                value={fmt(Cmaint_annual)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_over"
                value={fmt(Cover_annual)}
                unit="$/t"
                info={INFO}
              />
              <RowView
                label="OPEX_total"
                value={fmt(OPEX_total_with_overhead)}
                unit="$/t"
                info={INFO}
              />
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
