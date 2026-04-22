"use client";

import Tooltip from "@/components/Tooltip";
import {
  DollarSign,
} from "lucide-react";
import { useState, useEffect,useRef } from "react";

import jsPDF from "jspdf";
import { toPng } from "html-to-image";

import { INFO_MED,INFO_MSF, INFO_MVC, INFO_RO, INFO_MSH } from "./info";

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

// RO Water Cost
export function ROWaterCost() {
    const [isMaintenance, setIsMaintenance] = useState(true);
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

  // Plant management
const targetRef = useRef(null);
const [plant, setPlant] = usePersistentState("ro.plant", "RO Water Cost");
const [customPlants, setCustomPlants] = usePersistentState("ro.customPlants", {});
const [defaultPlantValues, setDefaultPlantValues] = usePersistentState("ro.defaultPlantValues", null);

const [plantEditMode, setPlantEditMode] = useState(false);
const [editingPlant, setEditingPlant] = useState("");
const [newPlantName, setNewPlantName] = useState("");
const [isNewPlant, setIsNewPlant] = useState(false);
const getCurrentPlantData = () => ({
  Md, M0, Na, Nc, PV1, PV2, PV3, PV4, Mem1, Mem2, Mem3, Mem4,
  Cnn, Cpv, Cmem1, Cmem2, Mfa, Mfc, Pfa, Mb, Pfb, Pfc, Pf0,
  Cpfa, Cpfb, Cpfc, Cp0, Cwt, Danti, Dacid, SEC, ELC, Celc,
  Rmem, Canti, Cacid, Cwash, Clabor, Cmaint, Cover, Cfilter,
  Cinstr, Cinst, Ceng, Cintake, Ccivil, pV, T0, S0, Sd, Y, r, LF, W
});

const applyPlantData = (data) => {
  if (!data) return;

  setMd(data.Md); setM0(data.M0); setNa(data.Na); setNc(data.Nc);
  setPV1(data.PV1); setPV2(data.PV2); setPV3(data.PV3); setPV4(data.PV4);
  setMem1(data.Mem1); setMem2(data.Mem2); setMem3(data.Mem3); setMem4(data.Mem4);
  setCnn(data.Cnn); setCpv(data.Cpv); setCmem1(data.Cmem1); setCmem2(data.Cmem2);
  setMfa(data.Mfa); setMfc(data.Mfc); setPfa(data.Pfa); setMb(data.Mb);
  setPfb(data.Pfb); setPfc(data.Pfc); setPf0(data.Pf0);
  setCpfa(data.Cpfa); setCpfb(data.Cpfb); setCpfc(data.Cpfc); setCp0(data.Cp0);
  setCwt(data.Cwt); setDanti(data.Danti); setDacid(data.Dacid);
  setSEC(data.SEC); setELC(data.ELC); setCelc(data.Celc); setRmem(data.Rmem);
  setCanti(data.Canti); setCacid(data.Cacid); setCwash(data.Cwash); setClabor(data.Clabor);
  setCmaint(data.Cmaint); setCover(data.Cover); setCfilter(data.Cfilter);
  setCinstr(data.Cinstr); setCinst(data.Cinst); setCeng(data.Ceng);
  setCintake(data.Cintake); setCcivil(data.Ccivil);
  setpV(data.pV); setT0(data.T0); setS0(data.S0); setSd(data.Sd);
  setY(data.Y); setr(data.r); setLF(data.LF); setW(data.W);
};

const saveEditedPlant = () => {
  const data = getCurrentPlantData();

  if (editingPlant === "RO Water Cost") {
    setDefaultPlantValues(data);
  } else {
    setCustomPlants({ ...customPlants, [editingPlant]: data });
  }

  setPlantEditMode(false);
  setEditingPlant("");
};

const handleAcceptNewPlant = () => {
  if (!newPlantName.trim()) return;

  const data = getCurrentPlantData();
  setCustomPlants({ ...customPlants, [newPlantName]: data });
  setPlant(newPlantName);

  setNewPlantName("");
  setIsNewPlant(false);
  setPlantEditMode(false);
};

const deletePlant = (name) => {
  const updated = { ...customPlants };
  delete updated[name];
  setCustomPlants(updated);

  setPlant("RO Water Cost");
  setPlantEditMode(false);
};

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
  doc.save("RO_Water_cost.pdf");
};

  return (
    <div className="max-w-6xl mx-auto w-full space-y-3 mt-5" ref={targetRef}>
             {isMaintenance && (
    <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold py-2 rounded-lg">
        
        {/* Spinner */}
        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>

        <span>Working On Save Plant...</span>
    </div>
    )}
      <div className="text-gray-300 px-4 font-semibold flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        <span className="text-base">Water Cost</span>
      </div>



 

      <Section title="RO Water Cost">
<div className="flex items-center gap-4 mb-3">

  {/* PLANT */}
  <div className="flex items-center gap-2">
    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
      Plant:
    </span>

    <select
      value={plant}
      onChange={(e) => {
        const val = e.target.value;
        setPlant(val);

        setPlantEditMode(false);
        setIsNewPlant(false);

        if (val === "RO Water Cost") {
          applyPlantData(defaultPlantValues || getCurrentPlantData());
        } else {
          applyPlantData(customPlants[val]);
        }
      }}
      className="bg-gray-100 border border-gray-300
                 rounded px-3 py-1 text-sm text-gray-800
                 focus:outline-none"
    >
      <option value="RO Water Cost">RO Water Cost</option>
      {Object.keys(customPlants).map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  </div>

  {/* EDIT */}
  <div className="flex items-center gap-2">
    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
      Edit:
    </span>

    <select
      defaultValue=""
      onChange={(e) => {
        const val = e.target.value;

        if (val === "__NEW__") {
          setIsNewPlant(true);
          setPlantEditMode(true);
        } else if (val) {
          setEditingPlant(val);
          setPlantEditMode(true);

          applyPlantData(
            val === "RO Water Cost"
              ? defaultPlantValues || getCurrentPlantData()
              : customPlants[val]
          );
        }
      }}
      className="bg-gray-100 border border-gray-300
                 rounded px-3 py-1 text-sm text-gray-800
                 focus:outline-none"
    >
      <option value="">-- select --</option>
      <option value="__NEW__">New Plant</option>
      <option value="RO Water Cost">RO Water Cost</option>
      {Object.keys(customPlants).map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  </div>

</div>
{plantEditMode && (
  <div className="flex items-center gap-3 p-3 mb-3 bg-gray-100 border border-gray-300 rounded">

    {/* INPUT / LABEL */}
    {isNewPlant ? (
      <input
        value={newPlantName}
        onChange={(e) => setNewPlantName(e.target.value)}
        placeholder="New plant name..."
        className="flex-1 h-9 px-3 text-sm bg-white border border-gray-300rounded outline-none"
        autoFocus
      />
    ) : (
      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
        Editing "{editingPlant}"
      </span>
    )}

    {/* BUTTONS */}
    <div className="flex items-center gap-2">
      
      <button
        onClick={() => setPlantEditMode(false)}
        className="px-4 h-9 text-sm rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:opacity-80"
      >
        Cancel
      </button>

      <button
        onClick={isNewPlant ? handleAcceptNewPlant : saveEditedPlant}
        disabled={isNewPlant && !newPlantName.trim()}
        className="px-4 h-9 text-sm rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
      >
        Accept
      </button>

      {!isNewPlant && editingPlant !== "RO Water Cost" && (
        <button
          onClick={() => deletePlant(editingPlant)}
          className="px-3 h-9 text-sm rounded bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>
      )}

    </div>
  </div>
)}
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
              info={INFO_RO}
            />

            <RowInput
              label="Nc"
              unit="#"
              value={Nc}
              onChange={setNc}
              info={INFO_RO}
            />

            <RowInput
              label="PV1"
              unit="#"
              value={PV1}
              onChange={setPV1}
              info={INFO_RO}
            />

            <RowInput
              label="PV2"
              unit="#"
              value={PV2}
              onChange={setPV2}
              info={INFO_RO}
            />

            <RowInput
              label="PV3"
              unit="#"
              value={PV3}
              onChange={setPV3}
              info={INFO_RO}
            />

            <RowInput
              label="PV4"
              unit="#"
              value={PV4}
              onChange={setPV4}
              info={INFO_RO}
            />

            <RowInput
              label="Mem1"
              unit="#"
              value={Mem1}
              onChange={setMem1}
              info={INFO_RO}
            />

            <RowInput
              label="Mem2"
              unit="#"
              value={Mem2}
              onChange={setMem2}
              info={INFO_RO}
            />

            <RowInput
              label="Mem3"
              unit="#"
              value={Mem3}
              onChange={setMem3}
              info={INFO_RO}
            />

            <RowInput
              label="Mem4"
              unit="#"
              value={Mem4}
              onChange={setMem4}
              info={INFO_RO}
            />

            <RowInput
              label="Md"
              unit="t/h"
              value={Md}
              onChange={setMd}
              info={INFO_RO}
            />

            <RowInput
              label="M0"
              unit="t/h"
              value={M0}
              onChange={setM0}
              info={INFO_RO}
            />

            <RowInput
              label="Mb"
              unit="t/h"
              value={Mb}
              onChange={setMb}
              info={INFO_RO}
            />

            <RowInput
              label="Mfa"
              unit="t/h"
              value={Mfa}
              onChange={setMfa}
              info={INFO_RO}
            />

            <RowInput
              label="Mfc"
              unit="t/h"
              value={Mfc}
              onChange={setMfc}
              info={INFO_RO}
            />

            <RowInput
              label="Pfa"
              unit="bar"
              value={Pfa}
              onChange={setPfa}
              info={INFO_RO}
            />

            <RowInput
              label="ΔPfb"
              unit="bar"
              value={Pfb}
              onChange={setPfb}
              info={INFO_RO}
            />

            <RowInput
              label="Pfc"
              unit="bar"
              value={Pfc}
              onChange={setPfc}
              info={INFO_RO}
            />

            <RowInput
              label="Pf0"
              unit="bar"
              value={Pf0}
              onChange={setPf0}
              info={INFO_RO}
            />

            <RowInput
              label="SEC"
              unit="MJ/t"
              value={SEC}
              onChange={setSEC}
              info={INFO_RO}
            />

            <RowInput
              label="ELC"
              unit="MJ/t"
              value={ELC}
              onChange={setELC}
              info={INFO_RO}
            />

            <RowInput
              label="Danti"
              unit="L/h"
              value={Danti}
              onChange={setDanti}
              info={INFO_RO}
            />

            <RowInput
              label="Dacid"
              unit="L/h"
              value={Dacid}
              onChange={setDacid}
              info={INFO_RO}
            />

            <RowInput
              label="pV"
              unit="-"
              value={pV}
              onChange={setpV}
              info={INFO_RO}
            />

            <RowInput
              label="T0"
              unit="°C"
              value={T0}
              onChange={setT0}
              info={INFO_RO}
            />

            <RowInput
              label="S0"
              unit="g/L"
              value={S0}
              onChange={setS0}
              info={INFO_RO}
            />

            <RowInput
              label="Sd"
              unit="g/L"
              value={Sd}
              onChange={setSd}
              info={INFO_RO}
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
              info={INFO_RO}
            />

            <RowInput
              label="LF"
              unit="-"
              value={LF}
              onChange={setLF}
              info={INFO_RO}
            />

            <RowInput
              label="r"
              unit="-"
              value={r}
              onChange={setr}
              info={INFO_RO}
            />

            <RowInput
              label="Cnn"
              unit="$/train"
              value={Cnn}
              onChange={setCnn}
              info={INFO_RO}
            />

            <RowInput
              label="Cpv"
              unit="$/vessel"
              value={Cpv}
              onChange={setCpv}
              info={INFO_RO}
            />

            <RowInput
              label="Cmem1"
              unit="$/elem"
              value={Cmem1}
              onChange={setCmem1}
              info={INFO_RO}
            />

            <RowInput
              label="Cmem2"
              unit="$/elem"
              value={Cmem2}
              onChange={setCmem2}
              info={INFO_RO}
            />

            <RowInput
              label="Cpfa"
              unit="$/(bar·t/h)"
              value={Cpfa}
              onChange={setCpfa}
              info={INFO_RO}
            />

            <RowInput
              label="Cpfb"
              unit="$/(bar·t/h)"
              value={Cpfb}
              onChange={setCpfb}
              info={INFO_RO}
            />

            <RowInput
              label="Cpfc"
              unit="$/(bar·t/h)"
              value={Cpfc}
              onChange={setCpfc}
              info={INFO_RO}
            />

            <RowInput
              label="Cp0"
              unit="$/(bar·t/h)"
              value={Cp0}
              onChange={setCp0}
              info={INFO_RO}
            />

            <RowInput
              label="Cwt"
              unit="$/(t/h)"
              value={Cwt}
              onChange={setCwt}
              info={INFO_RO}
            />

            <RowInput
              label="Cintake"
              unit="$/(t/h)"
              value={Cintake}
              onChange={setCintake}
              info={INFO_RO}
            />

            <RowInput
              label="Ccivil"
              unit="%"
              value={Ccivil}
              onChange={setCcivil}
              info={INFO_RO}
            />

            <RowInput
              label="Cinstr"
              unit="%"
              value={Cinstr}
              onChange={setCinstr}
              info={INFO_RO}
            />

            <RowInput
              label="Cinst"
              unit="%"
              value={Cinst}
              onChange={setCinst}
              info={INFO_RO}
            />

            <RowInput
              label="Ceng"
              unit="%"
              value={Ceng}
              onChange={setCeng}
              info={INFO_RO}
            />

            <RowInput
              label="Celc"
              unit="$/MJ"
              value={Celc}
              onChange={setCelc}
              info={INFO_RO}
            />

            <RowInput
              label="Rmem"
              unit="%"
              value={Rmem}
              onChange={setRmem}
              info={INFO_RO}
            />

            <RowInput
              label="Canti"
              unit="$/L"
              value={Canti}
              onChange={setCanti}
              info={INFO_RO}
            />

            <RowInput
              label="Cacid"
              unit="$/L"
              value={Cacid}
              onChange={setCacid}
              info={INFO_RO}
            />

            <RowInput
              label="Cwash"
              unit="$/elem/ev"
              value={Cwash}
              onChange={setCwash}
              info={INFO_RO}
            />

            <RowInput
              label="W"
              unit="#/yr"
              value={W}
              onChange={setW}
              info={INFO_RO}
            />

            <RowInput
              label="Clabor"
              unit="$/t"
              value={Clabor}
              onChange={setClabor}
              info={INFO_RO}
            />

            <RowInput
              label="Cfilter"
              unit="$/t"
              value={Cfilter}
              onChange={setCfilter}
              info={INFO_RO}
            />

            <RowInput
              label="Cmaint"
              unit="%"
              value={Cmaint}
              onChange={setCmaint}
              info={INFO_RO}
            />

            <RowInput
              label="Cover"
              unit="%"
              value={Cover}
              onChange={setCover}
              info={INFO_RO}
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
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_mem"
              value={fmt(CAPEX_mem)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_pumps"
              value={fmt(CAPEX_pumps)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_wt"
              value={fmt(CAPEX_wt)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_intake"
              value={fmt(CAPEX_intake_struct)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_equip"
              value={fmt(CAPEX_equip)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_civil"
              value={fmt(CAPEX_civil)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_instr"
              value={fmt(CAPEX_instrument)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_inst"
              value={fmt(CAPEX_inst)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_eng"
              value={fmt(CAPEX_eng)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_nn"
              value={fmt(CAPEX_nn)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_total"
              value={fmt(CAPEX_total)}
              unit="$"
              info={INFO_RO}
            />
            <RowView
              label="CAPEX_spec"
              value={fmt(CAPEX_specific)}
              unit="$/t"
              info={INFO_RO}
            />
            <RowView label="CRF" value={fmt(CRF)} unit="-" info={INFO_RO} />
            <RowView label="Ucap" value={fmt(Ucap)} unit="$/t" info={INFO_RO} />

            {/* ===== SECOND OUTPUTS (OPEX) ===== */}
            <div className="border-t border-gray-700 mt-4 pt-3">
              <div className="text-sm font-semibold text-gray-400 mb-2">
                Outputs
              </div>
              <RowView
                label="OPEX_sec"
                value={fmt(OPEX_sec)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_elc"
                value={fmt(OPEX_elc)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_mem"
                value={fmt(Cmembrane)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_anti"
                value={fmt(Cantiscalant)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_acid"
                value={fmt(Cacid_dose)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_wash"
                value={fmt(Cwashing)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_labor"
                value={fmt(Clabor)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_filter"
                value={fmt(Cfilter)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_maint"
                value={fmt(Cmaint_annual)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_over"
                value={fmt(Cover_annual)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView
                label="OPEX_total"
                value={fmt(OPEX_total_with_overhead)}
                unit="$/t"
                info={INFO_RO}
              />
              <RowView label="UPC" value={fmt(UPC)} unit="$/t" info={INFO_RO} />
            </div>
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
      </Section>
    </div>
  );
}

// MED Water Cost
export function MEDWaterCost() {
    const targetRef = useRef(null);

  const [Md, setMd] = usePersistentState("med.Md", 20000); // Product water capacity (t/h)
  const [M0, setM0] = usePersistentState("med.M0", 25000); // Raw feed water (t/h)
  const [Mf, setMf] = usePersistentState("med.Mf", 4000); // Feed water flow (t/h)
  const [Nef1, setNef1] = usePersistentState("med.Nef1", 4); // Number of MED effects in first section
  const [Nef2, setNef2] = usePersistentState("med.Nef2", 4); // Number of MED effects in second section
  const [Aa, setAa] = usePersistentState("med.Aa", 1500); // Area of each effect in first section (m²)
  const [Ab, setAb] = usePersistentState("med.Ab", 1000); // Area of each effect in second section (m²)
  const [Ac, setAc] = usePersistentState("med.Ac", 500); // Area of condenser (m²)
  const [Ad, setAd] = usePersistentState("med.Ad", 800); // Area of preheater (m²)
  const [Ae, setAe] = usePersistentState("med.Ae", 1200); // Area of absorber (m²)
  const [P0, setP0] = usePersistentState("med.P0", 2); // Intake pump pressure (bar)
  const [Pd, setPd] = usePersistentState("med.Pd", 2.5); // Discharge pump pressure (bar)
  const [VC, setVC] = usePersistentState("med.VC", 0); // Vapor compressor capacity (m³/s), set to 0 for standard MED
  const [AZ, setAZ] = usePersistentState("med.AZ", 0); // Absorber capacity (m³/s)
  const [SEC, setSEC] = usePersistentState("med.SEC", 120); // Specific steam exergy (MJ/t)
  const [ELC, setELC] = usePersistentState("med.ELC", 3.5); // Electricity consumption (MJ/t)
  const [Danti, setDanti] = usePersistentState("med.Danti", 2.5); // Antiscalant chemical dosing rate (L/h)
  const [Dacid, setDacid] = usePersistentState("med.Dacid", 1.0); // Acid chemical dosing rate (L/h)
  const [Y, setY] = usePersistentState("med.Y", 25); // Life span (years)
  const [LF, setLF] = usePersistentState("med.LF", 0.90); // Load factor
  const [r, setR] = usePersistentState("med.r", 0.06); // Discount rate

  // Group 2: Cost Factors
  const [Caa, setCaa] = usePersistentState("med.Caa", 150); // Brine heater area cost ($/m²)
  const [Cab, setCab] = usePersistentState("med.Cab", 140); // Effect area cost first section ($/m²)
  const [Cac, setCac] = usePersistentState("med.Cac", 130); // Effect area cost second section ($/m²)
  const [Cad, setCad] = usePersistentState("med.Cad", 120); // Condenser area cost ($/m²)
  const [Cp0, setCp0] = usePersistentState("med.Cp0", 8); // Intake pump cost factor ($/(bar·t/h))
  const [Cpd, setCpd] = usePersistentState("med.Cpd", 10); // Discharge pump cost factor ($/(bar·t/h))
  const [Cwt, setCwt] = usePersistentState("med.Cwt", 100); // Water treatment cost ($/(t/h))
  const [Cintake, setCintake] = usePersistentState("med.Cintake", 50); // Intake structure cost ($/(t/h))
  const [Csec, setCsec] = usePersistentState("med.Csec", 0.02); // Steam exergy price ($/MJ)
  const [Celc, setCelc] = usePersistentState("med.Celc", 0.022); // Electricity price ($/MJ)
  const [Cvc, setCvc] = usePersistentState("med.Cvc", 0); // VC cost factor ($/(m³/s))
  const [Caz, setCaz] = usePersistentState("med.Caz", 100); // Absorber cost factor ($/(m³/s))
  const [Cae, setCae] = usePersistentState("med.Cae", 130); // Absorber area cost ($/m²)
  const [Canti, setCanti] = usePersistentState("med.Canti", 2.5); // Antiscalant cost ($/L)
  const [Cacid, setCacid] = usePersistentState("med.Cacid", 0.3); // Acid cost ($/L)
  const [Clabor, setClabor] = usePersistentState("med.Clabor", 0.05); // Labor cost ($/t)
  const [Cmain, setCmain] = usePersistentState("med.Cmain", 2); // Maintenance cost (%/year)
  const [Cover, setCover] = usePersistentState("med.Cover", 10); // Overhead cost (% of OPEX-total)
  const [Cinstr, setCinstr] = usePersistentState("med.Cinstr", 10); // Instrumentation cost (% of equipment)
  const [Cinst, setCinst] = usePersistentState("med.Cinst", 15); // Installation cost (% of equipment)
  const [Ceng, setCeng] = usePersistentState("med.Ceng", 8); // Engineering cost (% of equipment)
  const [Ccivil, setCcivil] = usePersistentState("med.Ccivil", 5); // Civil works cost (% of CAPEX_equip)

  // Feed Water Parameters
  const [pV, setpV] = usePersistentState("med.pV", 7.5); // Feed water pH
  const [Ts, setTs] = usePersistentState("med.Ts", 80); // Steam temperature (°C)
  const [Td, setTd] = usePersistentState("med.Td", 40); // Distillate temperature (°C)
  const [T0, setT0] = usePersistentState("med.T0", 30); // Feed water temperature (°C)
  const [S0, setS0] = usePersistentState("med.S0", 40); // Feed water salinity (g/L)

  // Reset function
  const resetToDefaults = () => {
    setMd(20000);
    setM0(25000);
    setMf(4000);
    setNef1(4);
    setNef2(4);
    setAa(1500);
    setAb(1000);
    setAc(500);
    setAd(800);
    setAe(1200);
    setP0(2);
    setPd(2.5);
    setVC(0);
    setAZ(0);
    setSEC(120);
    setELC(3.5);
    setDanti(2.5);
    setDacid(1.0);
    setY(25);
    setLF(0.90);
    setR(0.06);
    setCaa(150);
    setCab(140);
    setCac(130);
    setCad(120);
    setCp0(8);
    setCpd(10);
    setCwt(100);
    setCintake(50);
    setCsec(0.02);
    setCelc(0.022);
    setCvc(0);
    setCaz(100);
    setCae(130);
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
    setTs(80);
    setTd(40);
    setT0(30);
    setS0(40);
  };

  // Group 3 & 4: Calculations
  const annualProduction = Md * 8760 * LF;
  const Nef = Nef1 + Nef2; // Total number of effects

  // CAPEX Calculations
  const CAPEX_area = Nef1 * Aa * Caa + Nef2 * Ab * Cab + Ac * Cac + Ad * Cad + Ae * Cae;
  const CAPEX_az = AZ * Caz;
  const CAPEX_pump_0 = Cp0 * Math.pow(P0 * M0, 0.8); // Intake pump
  const CAPEX_pump_d = Cpd * Math.pow(Pd * Mf, 0.8); // Discharge pump
  const CAPEX_Pump = CAPEX_pump_0 + CAPEX_pump_d;
  const CAPEX_wt = M0 * Cwt;
  const CAPEX_intake = M0 * Cintake;
  const CAPEX_vc = VC * Cvc;
  const CAPEX_equip = CAPEX_area + CAPEX_az + CAPEX_Pump + CAPEX_wt + CAPEX_intake + CAPEX_vc;
  const CAPEX_civil = (Ccivil / 100) * CAPEX_equip;
  const CAPEX_instr = (Cinstr / 100) * CAPEX_equip;
  const CAPEX_inst = (Cinst / 100) * CAPEX_equip;
  const CAPEX_eng = (Ceng / 100) * CAPEX_equip;
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
  doc.save("MED_Water_cost.pdf");
};
  
     return (
        <div className="max-w-6xl mx-auto w-full space-y-3 my-5" ref={targetRef}>

          <Section title="MED Water Cost">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ================= COLUMN 1 ================= */}
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-2">
                  Inputs
                </div>
                <RowInput label="Nef1" unit="#" value={Nef1} onChange={setNef1} info={INFO_MED} />
                <RowInput label="Nef2" unit="#" value={Nef2} onChange={setNef2} info={INFO_MED} />

                <RowInput label="Aa" unit="m²" value={Aa} onChange={setAa} info={INFO_MED} />
                <RowInput label="Ab" unit="m²" value={Ab} onChange={setAb} info={INFO_MED} />
                <RowInput label="Ac" unit="m²" value={Ac} onChange={setAc} info={INFO_MED} />
                <RowInput label="Ad" unit="m²" value={Ad} onChange={setAd} info={INFO_MED} />
                <RowInput label="Ae" unit="m²" value={Ae} onChange={setAe} info={INFO_MED} />

                <RowInput label="P0" unit="bar" value={P0} onChange={setP0} info={INFO_MED} />
                <RowInput label="Pd" unit="bar" value={Pd} onChange={setPd} info={INFO_MED} />

                <RowInput label="VC" unit="m³/s" value={VC} onChange={setVC} info={INFO_MED} />
                <RowInput label="AZ" unit="m³/s" value={AZ} onChange={setAZ} info={INFO_MED} />

                <RowInput label="Md" unit="t/h" value={Md} onChange={setMd} info={INFO_MED} />
                <RowInput label="M0" unit="t/h" value={M0} onChange={setM0} info={INFO_MED} />
                <RowInput label="Mf" unit="t/h" value={Mf} onChange={setMf} info={INFO_MED} />

                <RowInput label="SEC" unit="MJ/t" value={SEC} onChange={setSEC} info={INFO_MED} />
                <RowInput label="ELC" unit="MJ/t" value={ELC} onChange={setELC} info={INFO_MED} />

                <RowInput label="Danti" unit="L/h" value={Danti} onChange={setDanti} info={INFO_MED} />
                <RowInput label="Dacid" unit="L/h" value={Dacid} onChange={setDacid} info={INFO_MED} />

                <RowInput label="pV" unit="-" value={pV} onChange={setpV} info={INFO_MED} />

                <RowInput label="Ts" unit="°C" value={Ts} onChange={setTs} info={INFO_MED} />
                <RowInput label="Td" unit="°C" value={Td} onChange={setTd} info={INFO_MED} />
                <RowInput label="T0" unit="°C" value={T0} onChange={setT0} info={INFO_MED} />

                <RowInput label="S0" unit="g/L" value={S0} onChange={setS0} info={INFO_MED} />               
              </div>
    
              {/* ================= COLUMN 2 ================= */}
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-2">
                  Factors
                </div>
                <RowInput label="Y" unit="yr" value={Y} onChange={setY} info={INFO_MED} />
                <RowInput label="LF" unit="-" value={LF} onChange={setLF} info={INFO_MED} />
                <RowInput label="r" unit="-" value={r} onChange={setR} info={INFO_MED} />

                {/* CAPEX Cost Factors */}
                <RowInput label="Caa" unit="$/m²" value={Caa} onChange={setCaa} info={INFO_MED} />
                <RowInput label="Cab" unit="$/m²" value={Cab} onChange={setCab} info={INFO_MED} />
                <RowInput label="Cac" unit="$/m²" value={Cac} onChange={setCac} info={INFO_MED} />
                <RowInput label="Cad" unit="$/m²" value={Cad} onChange={setCad} info={INFO_MED} />
                <RowInput label="Cae" unit="$/m²" value={Cae} onChange={setCae} info={INFO_MED} />

                <RowInput label="Cp0" unit="$/(bar·t/h)" value={Cp0} onChange={setCp0} info={INFO_MED} />
                <RowInput label="Cpd" unit="$/(bar·t/h)" value={Cpd} onChange={setCpd} info={INFO_MED} />

                <RowInput label="Cvc" unit="$/(m³/s)" value={Cvc} onChange={setCvc} info={INFO_MED} />
                <RowInput label="Caz" unit="$/(m³/s)" value={Caz} onChange={setCaz} info={INFO_MED} />

                <RowInput label="Cwt" unit="$/(t/h)" value={Cwt} onChange={setCwt} info={INFO_MED} />
                <RowInput label="Cintake" unit="$/(t/h)" value={Cintake} onChange={setCintake} info={INFO_MED} />

                <RowInput label="Ccivil" unit="%" value={Ccivil} onChange={setCcivil} info={INFO_MED} />
                <RowInput label="Cinstr" unit="%" value={Cinstr} onChange={setCinstr} info={INFO_MED} />
                <RowInput label="Cinst" unit="%" value={Cinst} onChange={setCinst} info={INFO_MED} />
                <RowInput label="Ceng" unit="%" value={Ceng} onChange={setCeng} info={INFO_MED} />

                {/* OPEX Cost Factors */}
                <RowInput label="Csec" unit="$/MJ" value={Csec} onChange={setCsec} info={INFO_MED} />
                <RowInput label="Celc" unit="$/MJ" value={Celc} onChange={setCelc} info={INFO_MED} />

                <RowInput label="Canti" unit="$/L" value={Canti} onChange={setCanti} info={INFO_MED} />
                <RowInput label="Cacid" unit="$/L" value={Cacid} onChange={setCacid} info={INFO_MED} />

                <RowInput label="Clabor" unit="$/t" value={Clabor} onChange={setClabor} info={INFO_MED} />

                <RowInput label="Cmain" unit="%/yr" value={Cmain} onChange={setCmain} info={INFO_MED} />
                <RowInput label="Cover" unit="%" value={Cover} onChange={setCover} info={INFO_MED} />

              </div>
    
              {/* ================= OUTPUTS ================= */}
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-2">
                  Outputs
                </div>
                {/* ===== TOP OUTPUTS (CAPEX) ===== */}
                    <RowView label="CAPEX_area" value={fmt(CAPEX_area)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_Pump" value={fmt(CAPEX_Pump)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_wt" value={fmt(CAPEX_wt)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_intake" value={fmt(CAPEX_intake)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_vc" value={fmt(CAPEX_vc)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_az" value={fmt(CAPEX_az)} unit="$" info={INFO_MED} />

                    <RowView label="CAPEX_equip" value={fmt(CAPEX_equip)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_civil" value={fmt(CAPEX_civil)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_instr" value={fmt(CAPEX_instr)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_inst" value={fmt(CAPEX_inst)} unit="$" info={INFO_MED} />
                    <RowView label="CAPEX_eng" value={fmt(CAPEX_eng)} unit="$" info={INFO_MED} />

                    <RowView label="CAPEX_total" value={fmt(CAPEX_total)} unit="$" info={INFO_MED} />
                    <RowView label="CAPX_spec" value={fmt(CAPX_spec)} unit="$/(t/h)" info={INFO_MED} />

                    <RowView label="CRF" value={fmt(CRF)} unit="-" info={INFO_MED} />
                    <RowView label="Ucap" value={fmt(Ucap)} unit="$/t" info={INFO_MED} />

                {/* ===== SECOND OUTPUTS (OPEX) ===== */}
                <div className="border-t border-gray-700 mt-4 pt-3">
                  <div className="text-sm font-semibold text-gray-400 mb-2">
                    Outputs
                  </div>

                    <RowView label="OPEX_sec" value={fmt(OPEX_sec)} unit="$/t" info={INFO_MED} />
                    <RowView label="OPEX_elc" value={fmt(OPEX_elc)} unit="$/t" info={INFO_MED} />
                    <RowView label="OPEX_anti" value={fmt(Cantiscalant)} unit="$/t" info={INFO_MED} />
                    <RowView label="OPEX_acid" value={fmt(Cacid_dose)} unit="$/t" info={INFO_MED} />

                    <RowView label="OPEX_labor" value={fmt(Clabor)} unit="$/t" info={INFO_MED} />
                    <RowView label="OPEX_maint" value={fmt(Cmain_annual)} unit="$/t" info={INFO_MED} />
                    <RowView label="OPEX_over" value={fmt(Cover_annual)} unit="$/t" info={INFO_MED} />
                    <RowView label="OPEX_total" value={fmt(OPEX_total_with_overhead)} unit="$/t" info={INFO_MED} />

                    <RowView label="UPC" value={fmt(UPC)} unit="$/t" info={INFO_MED} />
                </div>
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
          </Section>
        </div>
      );
}
// MVC Water Cost
export function MVCWaterCost(){
 const targetRef = useRef(null);
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
     doc.save("MVC_Water_cost.pdf");
   };
    
  
        return (
          <div className="max-w-6xl mx-auto w-full space-y-3 my-5" ref={targetRef}>
  
            <Section title="MVC Water Cost">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ================= COLUMN 1 ================= */}
                <div>
                  <div className="text-sm font-semibold text-gray-400 mb-2">
                    Inputs
                  </div>
                    <RowInput label="Nef" unit="#" value={Nef} onChange={setNef} info={INFO_MVC} />
                    <RowInput label="Aa" unit="m²" value={Aa} onChange={setAa} info={INFO_MVC} />
                    <RowInput label="Ab" unit="m²" value={Ab} onChange={setAb} info={INFO_MVC} />

                    <RowInput label="Md" unit="t/h" value={Md} onChange={setMd} info={INFO_MVC} />
                    <RowInput label="M0" unit="t/h" value={M0} onChange={setM0} info={INFO_MVC} />
                    <RowInput label="Mf" unit="t/h" value={Mf} onChange={setMf} info={INFO_MVC} />
                    <RowInput label="Mb" unit="t/h" value={Mb} onChange={setMb} info={INFO_MVC} />

                    <RowInput label="P0" unit="bar" value={P0} onChange={setP0} info={INFO_MVC} />
                    <RowInput label="Pf" unit="bar" value={Pf} onChange={setPf} info={INFO_MVC} />
                    <RowInput label="Pb" unit="bar" value={Pb} onChange={setPb} info={INFO_MVC} />
                    <RowInput label="Pd" unit="bar" value={Pd} onChange={setPd} info={INFO_MVC} />

                    <RowInput label="VC" unit="m³/s" value={VC} onChange={setVC} info={INFO_MVC} />
                    <RowInput label="Pvc" unit="kW" value={Pvc} onChange={setPvc} info={INFO_MVC} />

                    <RowInput label="SEC" unit="MJ/t" value={SEC} onChange={setSEC} info={INFO_MVC} />
                    <RowInput label="ELC" unit="MJ/t" value={ELC} onChange={setELC} info={INFO_MVC} />

                    <RowInput label="Danti" unit="L/h" value={Danti} onChange={setDanti} info={INFO_MVC} />
                    <RowInput label="Dacid" unit="L/h" value={Dacid} onChange={setDacid} info={INFO_MVC} />

                    <RowInput label="pV" unit="-" value={pV} onChange={setpV} info={INFO_MVC} />

                    <RowInput label="Ts" unit="°C" value={Ts} onChange={setTs} info={INFO_MVC} />
                    <RowInput label="Te" unit="°C" value={Te} onChange={setTe} info={INFO_MVC} />
                    <RowInput label="T0" unit="°C" value={T0} onChange={setT0} info={INFO_MVC} />

                    <RowInput label="S0" unit="g/L" value={S0} onChange={setS0} info={INFO_MVC} />
                                      
                </div>
      
                {/* ================= COLUMN 2 ================= */}
                <div>
                  <div className="text-sm font-semibold text-gray-400 mb-2">
                    Factors
                  </div>
                    <RowInput label="Y" unit="yr" value={Y} onChange={setY} info={INFO_MVC} />
                    <RowInput label="LF" unit="-" value={LF} onChange={setLF} info={INFO_MVC} />
                    <RowInput label="r" unit="-" value={r} onChange={setR} info={INFO_MVC} />

                    <RowInput label="Cef" unit="$/effect" value={Cef} onChange={setCef} info={INFO_MVC} />
                    <RowInput label="Caa" unit="$/m²" value={Caa} onChange={setCaa} info={INFO_MVC} />
                    <RowInput label="Cab" unit="$/m²" value={Cab} onChange={setCab} info={INFO_MVC} />

                    <RowInput label="Cvc" unit="$/(m³/s)" value={Cvc} onChange={setCvc} info={INFO_MVC} />

                    <RowInput label="Cp0" unit="$/(bar·t/h)" value={Cp0} onChange={setCp0} info={INFO_MVC} />
                    <RowInput label="Cpf" unit="$/(bar·t/h)" value={Cpf} onChange={setCpf} info={INFO_MVC} />
                    <RowInput label="Cpb" unit="$/(bar·t/h)" value={Cpb} onChange={setCpb} info={INFO_MVC} />
                    <RowInput label="Cpd" unit="$/(bar·t/h)" value={Cpd} onChange={setCpd} info={INFO_MVC} />

                    <RowInput label="Cwt" unit="$/(t/h)" value={Cwt} onChange={setCwt} info={INFO_MVC} />
                    <RowInput label="Cintake" unit="$/(t/h)" value={Cintake} onChange={setCintake} info={INFO_MVC} />

                    <RowInput label="Ccivil" unit="%" value={Ccivil} onChange={setCcivil} info={INFO_MVC} />
                    <RowInput label="Cinstr" unit="%" value={Cinstr} onChange={setCinstr} info={INFO_MVC} />
                    <RowInput label="Cinst" unit="%" value={Cinst} onChange={setCinst} info={INFO_MVC} />
                    <RowInput label="Ceng" unit="%" value={Ceng} onChange={setCeng} info={INFO_MVC} />

                    <RowInput label="Csec" unit="$/MJ" value={Csec} onChange={setCsec} info={INFO_MVC} />
                    <RowInput label="Celc" unit="$/MJ" value={Celc} onChange={setCelc} info={INFO_MVC} />

                    <RowInput label="Canti" unit="$/L" value={Canti} onChange={setCanti} info={INFO_MVC} />
                    <RowInput label="Cacid" unit="$/L" value={Cacid} onChange={setCacid} info={INFO_MVC} />

                    <RowInput label="Clabor" unit="$/t" value={Clabor} onChange={setClabor} info={INFO_MVC} />
                    <RowInput label="Cmain" unit="%/yr" value={Cmain} onChange={setCmain} info={INFO_MVC} />
                    <RowInput label="Cover" unit="%" value={Cover} onChange={setCover} info={INFO_MVC} />
                </div>
      
                {/* ================= OUTPUTS ================= */}
                <div>
                  <div className="text-sm font-semibold text-gray-400 mb-2">
                    Outputs
                  </div>
                  {/* ===== TOP OUTPUTS (CAPEX) ===== */}
                  <RowView label="CAPEX_ef" value={fmt(CAPEX_ef)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_area" value={fmt(CAPEX_area)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_vc" value={fmt(CAPEX_vc)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_Pump" value={fmt(CAPEX_Pump)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_wt" value={fmt(CAPEX_wt)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_intake" value={fmt(CAPEX_intake)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_equip" value={fmt(CAPEX_equip)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_civil" value={fmt(CAPEX_civil)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_instr" value={fmt(CAPEX_instr)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_inst" value={fmt(CAPEX_inst)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_eng" value={fmt(CAPEX_eng)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPEX_total" value={fmt(CAPEX_total)} unit="$" info={INFO_MVC} />
                  <RowView label="CAPX_spec" value={fmt(CAPX_spec)} unit="$/(t/h)" info={INFO_MVC} />
                  <RowView label="CRF" value={fmt(CRF)} unit="-" info={INFO_MVC} />
                  <RowView label="Ucap" value={fmt(Ucap)} unit="$/t" info={INFO_MVC} />
                  {/* ===== SECOND OUTPUTS (OPEX) ===== */}
                  <div className="border-t border-gray-700 mt-4 pt-3">
                    <div className="text-sm font-semibold text-gray-400 mb-2">
                      Outputs
                    </div>
                     <RowView label="OPEX_sec" value={fmt(OPEX_sec)} unit="$/t" info={INFO_MVC} />
                    <RowView label="OPEX_elc" value={fmt(OPEX_elc)} unit="$/t" info={INFO_MVC} />
                    <RowView label="OPEX_anti" value={fmt(Cantiscalant)} unit="$/t" info={INFO_MVC} />
                    <RowView label="OPEX_acid" value={fmt(Cacid_dose)} unit="$/t" info={INFO_MVC} />

                    <RowView label="OPEX_labor" value={fmt(Clabor)} unit="$/t" info={INFO_MVC} />
                    <RowView label="OPEX_maint" value={fmt(Cmain_annual)} unit="$/t" info={INFO_MVC} />
                    <RowView label="OPEX_over" value={fmt(Cover_annual)} unit="$/t" info={INFO_MVC} />
                    <RowView label="OPEX_total" value={fmt(OPEX_total_with_overhead)} unit="$/t" info={INFO_MVC} />
                    <RowView label="UPC" value={fmt(UPC)} unit="$/t" info={INFO_MVC} />
                  </div>
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
            </Section>
          </div>
        );

}

// MSF Water cost
export function MSFWaterCost(){
 const targetRef = useRef(null);
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
  doc.save("MSF_Water_cost.pdf");
};

      return (
        <div className="max-w-6xl mx-auto w-full space-y-3 my-5" ref={targetRef}>

          <Section title="MSF Water Cost">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ================= COLUMN 1 ================= */}
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-2">
                  Inputs
                </div>
                <RowInput label="Nst1" unit="#" value={Nst1} onChange={setNst1} info={INFO_MSF} />
                <RowInput label="Nst2" unit="#" value={Nst2} onChange={setNst2} info={INFO_MSF} />
                <RowInput label="Nst3" unit="#" value={Nst3} onChange={setNst3} info={INFO_MSF} />

                <RowInput label="Aa" unit="m²" value={Aa} onChange={setAa} info={INFO_MSF} />
                <RowInput label="Ab" unit="m²" value={Ab} onChange={setAb} info={INFO_MSF} />
                <RowInput label="Ac" unit="m²" value={Ac} onChange={setAc} info={INFO_MSF} />
                <RowInput label="Ad" unit="m²" value={Ad} onChange={setAd} info={INFO_MSF} />

                <RowInput label="Md" unit="t/h" value={Md} onChange={setMd} info={INFO_MSF} />
                <RowInput label="M0" unit="t/h" value={M0} onChange={setM0} info={INFO_MSF} />
                <RowInput label="Mf" unit="t/h" value={Mf} onChange={setMf} info={INFO_MSF} />
                <RowInput label="Mr" unit="t/h" value={Mr} onChange={setMr} info={INFO_MSF} />

                <RowInput label="P0" unit="bar" value={P0} onChange={setP0} info={INFO_MSF} />
                <RowInput label="Pr" unit="bar" value={Pr} onChange={setPr} info={INFO_MSF} />
                <RowInput label="Pd" unit="bar" value={Pd} onChange={setPd} info={INFO_MSF} />

                <RowInput label="VC" unit="m³/s" value={VC} onChange={setVC} info={INFO_MSF} />
                <RowInput label="AZ" unit="m³/s" value={AZ} onChange={setAZ} info={INFO_MSF} />

                <RowInput label="SEC" unit="MJ/t" value={SEC} onChange={setSEC} info={INFO_MSF} />
                <RowInput label="ELC" unit="MJ/t" value={ELC} onChange={setELC} info={INFO_MSF} />

                <RowInput label="Danti" unit="L/h" value={Danti} onChange={setDanti} info={INFO_MSF} />
                <RowInput label="Dacid" unit="L/h" value={Dacid} onChange={setDacid} info={INFO_MSF} />

                <RowInput label="pV" unit="-" value={pV} onChange={setpV} info={INFO_MSF} />

                <RowInput label="Th" unit="°C" value={Th} onChange={setTh} info={INFO_MSF} />
                <RowInput label="Tb" unit="°C" value={Tb} onChange={setTb} info={INFO_MSF} />
                <RowInput label="T0" unit="°C" value={T0} onChange={setT0} info={INFO_MSF} />

                <RowInput label="S0" unit="g/L" value={S0} onChange={setS0} info={INFO_MSF} />
                                    
              </div>
    
              {/* ================= COLUMN 2 ================= */}
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-2">
                  Factors
                </div>
                <RowInput label="Y" unit="yr" value={Y} onChange={setY} info={INFO_MSF} />
                <RowInput label="LF" unit="-" value={LF} onChange={setLF} info={INFO_MSF} />
                <RowInput label="r" unit="-" value={r} onChange={setR} info={INFO_MSF} />

                <RowInput label="Caa" unit="$/m²" value={Caa} onChange={setCaa} info={INFO_MSF} />
                <RowInput label="Cab" unit="$/m²" value={Cab} onChange={setCab} info={INFO_MSF} />
                <RowInput label="Cac" unit="$/m²" value={Cac} onChange={setCac} info={INFO_MSF} />
                <RowInput label="Cad" unit="$/m²" value={Cad} onChange={setCad} info={INFO_MSF} />

                <RowInput label="Cp0" unit="$/(bar·t/h)" value={Cp0} onChange={setCp0} info={INFO_MSF} />
                <RowInput label="Cpr" unit="$/(bar·t/h)" value={Cpr} onChange={setCpr} info={INFO_MSF} />
                <RowInput label="Cpd" unit="$/(bar·t/h)" value={Cpd} onChange={setCpd} info={INFO_MSF} />

                <RowInput label="Cvc" unit="$/(m³/s)" value={Cvc} onChange={setCvc} info={INFO_MSF} />
                <RowInput label="Caz" unit="$/(m³/s)" value={Caz} onChange={setCaz} info={INFO_MSF} />

                <RowInput label="Cwt" unit="$/(t/h)" value={Cwt} onChange={setCwt} info={INFO_MSF} />
                <RowInput label="Cintake" unit="$/(t/h)" value={Cintake} onChange={setCintake} info={INFO_MSF} />

                <RowInput label="Ccivil" unit="%" value={Ccivil} onChange={setCcivil} info={INFO_MSF} />
                <RowInput label="Cinstr" unit="%" value={Cinstr} onChange={setCinstr} info={INFO_MSF} />
                <RowInput label="Cinst" unit="%" value={Cinst} onChange={setCinst} info={INFO_MSF} />
                <RowInput label="Ceng" unit="%" value={Ceng} onChange={setCeng} info={INFO_MSF} />

                <RowInput label="Csec" unit="$/MJ" value={Csec} onChange={setCsec} info={INFO_MSF} />
                <RowInput label="Celc" unit="$/MJ" value={Celc} onChange={setCelc} info={INFO_MSF} />

                <RowInput label="Canti" unit="$/L" value={Canti} onChange={setCanti} info={INFO_MSF} />
                <RowInput label="Cacid" unit="$/L" value={Cacid} onChange={setCacid} info={INFO_MSF} />

                <RowInput label="Clabor" unit="$/t" value={Clabor} onChange={setClabor} info={INFO_MSF} />

                <RowInput label="Cmain" unit="%/yr" value={Cmain} onChange={setCmain} info={INFO_MSF} />
                <RowInput label="Cover" unit="%" value={Cover} onChange={setCover} info={INFO_MSF} />
              </div>
    
              {/* ================= OUTPUTS ================= */}
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-2">
                  Outputs
                </div>
                {/* ===== TOP OUTPUTS (CAPEX) ===== */}
                <RowView label="CAPEX_area" value={fmt(CAPEX_area)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_Pump" value={fmt(CAPEX_Pump)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_wt" value={fmt(CAPEX_wt)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_intake" value={fmt(CAPEX_intake)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_vc" value={fmt(CAPEX_vc)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_az" value={fmt(CAPEX_az)} unit="$" info={INFO_MSF} />

                <RowView label="CAPEX_equip" value={fmt(CAPEX_equip)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_civil" value={fmt(CAPEX_civil)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_instr" value={fmt(CAPEX_instr)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_inst" value={fmt(CAPEX_inst)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_eng" value={fmt(CAPEX_eng)} unit="$" info={INFO_MSF} />

                <RowView label="CAPEX_total" value={fmt(CAPEX_total)} unit="$" info={INFO_MSF} />
                <RowView label="CAPEX_spec" value={fmt(CAPX_spec)} unit="$/(t/h)" info={INFO_MSF} />

                <RowView label="CRF" value={fmt(CRF)} unit="-" info={INFO_MSF} />
                <RowView label="Ucap" value={fmt(Ucap)} unit="$/t" info={INFO_MSF} />
                {/* ===== SECOND OUTPUTS (OPEX) ===== */}
                <div className="border-t border-gray-700 mt-4 pt-3">
                  <div className="text-sm font-semibold text-gray-400 mb-2">
                    Outputs
                  </div>
                    <RowView label="OPEX_sec" value={fmt(OPEX_sec)} unit="$/t" info={INFO_MSF} />
                    <RowView label="OPEX_elc" value={fmt(OPEX_elc)} unit="$/t" info={INFO_MSF} />
                    <RowView label="OPEX_anti" value={fmt(Cantiscalant)} unit="$/t" info={INFO_MSF} />
                    <RowView label="OPEX_acid" value={fmt(Cacid_dose)} unit="$/t" info={INFO_MSF} />

                    <RowView label="OPEX_labor" value={fmt(Clabor)} unit="$/t" info={INFO_MSF} />
                    <RowView label="OPEX_maint" value={fmt(Cmain_annual)} unit="$/t" info={INFO_MSF} />
                    <RowView label="OPEX_over" value={fmt(Cover_annual)} unit="$/t" info={INFO_MSF} />
                    <RowView label="OPEX_total" value={fmt(OPEX_total_with_overhead)} unit="$/t" info={INFO_MSF} />

                    <RowView label="UPC" value={fmt(UPC)} unit="$/t" info={INFO_MSF} />
                </div>
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
          </Section>
        </div>
      );
} 

// MSH Water cost 
export function MSHWaterCost(){
 const targetRef = useRef(null);

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
  doc.save("MSH_Water_cost.pdf");
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

  

    
          return (
            <div className="max-w-6xl mx-auto w-full space-y-3 my-5" ref={targetRef}>
    
              <Section title="MSH Water Cost">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* ================= COLUMN 1 ================= */}
                  <div>
                    <div className="text-sm font-semibold text-gray-400 mb-2">
                      Inputs
                    </div>
                    <RowInput label="Nst" unit="#" value={Nst} onChange={setNst} info={INFO_MSH} />
                    <RowInput label="Nef1" unit="#" value={Nef1} onChange={setNef1} info={INFO_MSH} />
                    <RowInput label="Nef2" unit="#" value={Nef2} onChange={setNef2} info={INFO_MSH} />

                    <RowInput label="Aa" unit="m²" value={Aa} onChange={setAa} info={INFO_MSH} />
                    <RowInput label="Ab" unit="m²" value={Ab} onChange={setAb} info={INFO_MSH} />
                    <RowInput label="Ac" unit="m²" value={Ac} onChange={setAc} info={INFO_MSH} />
                    <RowInput label="Ad" unit="m²" value={Ad} onChange={setAd} info={INFO_MSH} />
                    <RowInput label="Ae" unit="m²" value={Ae} onChange={setAe} info={INFO_MSH} />
                    <RowInput label="Af" unit="m²" value={Af} onChange={setAf} info={INFO_MSH} />

                    <RowInput label="P0" unit="bar" value={P0} onChange={setP0} info={INFO_MSH} />
                    <RowInput label="Pd" unit="bar" value={Pd} onChange={setPd} info={INFO_MSH} />

                    <RowInput label="VC" unit="m³/s" value={VC} onChange={setVC} info={INFO_MSH} />
                    <RowInput label="AZ" unit="m³/s" value={AZ} onChange={setAZ} info={INFO_MSH} />

                    <RowInput label="Md" unit="t/h" value={Md} onChange={setMd} info={INFO_MSH} />
                    <RowInput label="M0" unit="t/h" value={M0} onChange={setM0} info={INFO_MSH} />
                    <RowInput label="Mf" unit="t/h" value={Mf} onChange={setMf} info={INFO_MSH} />

                    <RowInput label="SEC" unit="MJ/t" value={SEC} onChange={setSEC} info={INFO_MSH} />
                    <RowInput label="ELC" unit="MJ/t" value={ELC} onChange={setELC} info={INFO_MSH} />

                    <RowInput label="Danti" unit="L/h" value={Danti} onChange={setDanti} info={INFO_MSH} />
                    <RowInput label="Dacid" unit="L/h" value={Dacid} onChange={setDacid} info={INFO_MSH} />

                    <RowInput label="pV" unit="-" value={pV} onChange={setpV} info={INFO_MSH} />

                    <RowInput label="Th" unit="°C" value={Th} onChange={setTh} info={INFO_MSH} />
                    <RowInput label="Td" unit="°C" value={Td} onChange={setTd} info={INFO_MSH} />
                    <RowInput label="T0" unit="°C" value={T0} onChange={setT0} info={INFO_MSH} />

                    <RowInput label="S0" unit="g/L" value={S0} onChange={setS0} info={INFO_MSH} />

                                        
                  </div>
        
                  {/* ================= COLUMN 2 ================= */}
                  <div>
                    <div className="text-sm font-semibold text-gray-400 mb-2">
                      Factors
                    </div>
                     <RowInput label="Y" unit="yr" value={Y} onChange={setY} info={INFO_MSH} />
                    <RowInput label="LF" unit="-" value={LF} onChange={setLF} info={INFO_MSH} />
                    <RowInput label="r" unit="-" value={r} onChange={setR} info={INFO_MSH} />
                    <RowInput label="Caa" unit="$/m²" value={Caa} onChange={setCaa} info={INFO_MSH} />
                    <RowInput label="Cab" unit="$/m²" value={Cab} onChange={setCab} info={INFO_MSH} />
                    <RowInput label="Cac" unit="$/m²" value={Cac} onChange={setCac} info={INFO_MSH} />
                    <RowInput label="Cad" unit="$/m²" value={Cad} onChange={setCad} info={INFO_MSH} />
                    <RowInput label="Cae" unit="$/m²" value={Cae} onChange={setCae} info={INFO_MSH} />
                    <RowInput label="Caf" unit="$/m²" value={Caf} onChange={setCaf} info={INFO_MSH} />

                    <RowInput label="Cp0" unit="$/(bar·t/h)" value={Cp0} onChange={setCp0} info={INFO_MSH} />
                    <RowInput label="Cpd" unit="$/(bar·t/h)" value={Cpd} onChange={setCpd} info={INFO_MSH} />
                    <RowInput label="Cvc" unit="$/(m³/s)" value={Cvc} onChange={setCvc} info={INFO_MSH} />
                    <RowInput label="Caz" unit="$/(m³/s)" value={Caz} onChange={setCaz} info={INFO_MSH} />

                    <RowInput label="Cwt" unit="$/(t/h)" value={Cwt} onChange={setCwt} info={INFO_MSH} />
                    <RowInput label="Cintake" unit="$/(t/h)" value={Cintake} onChange={setCintake} info={INFO_MSH} />

                    <RowInput label="Cinst" unit="%" value={Cinst} onChange={setCinst} info={INFO_MSH} />
                    <RowInput label="Ceng" unit="%" value={Ceng} onChange={setCeng} info={INFO_MSH} />

                    <RowInput label="Csec" unit="$/MJ" value={Csec} onChange={setCsec} info={INFO_MSH} />
                    <RowInput label="Celc" unit="$/MJ" value={Celc} onChange={setCelc} info={INFO_MSH} />
                    <RowInput label="Canti" unit="$/L" value={Canti} onChange={setCanti} info={INFO_MSH} />
                    <RowInput label="Cacid" unit="$/L" value={Cacid} onChange={setCacid} info={INFO_MSH} />
                    <RowInput label="Clabor" unit="$/t" value={Clabor} onChange={setClabor} info={INFO_MSH} />
                    <RowInput label="Cmain" unit="%/yr" value={Cmain} onChange={setCmain} info={INFO_MSH} />
                    <RowInput label="Cover" unit="%" value={Cover} onChange={setCover} info={INFO_MSH} />

                  </div>
        
                  {/* ================= OUTPUTS ================= */}
                  <div>
                    <div className="text-sm font-semibold text-gray-400 mb-2">
                      Outputs
                    </div>
                    {/* ===== TOP OUTPUTS (CAPEX) ===== */}
                    <RowView label="CAPEX_area" value={fmt(CAPEX_area)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPEX_Pump" value={fmt(CAPEX_Pump)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPEX_wt" value={fmt(CAPEX_wt)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPEX_intake" value={fmt(CAPEX_intake)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPEX_vc" value={fmt(CAPEX_vc)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPEX_az" value={fmt(CAPEX_az)} unit="$" info={INFO_MSH} />

                    <RowView label="CAPEX_equip" value={fmt(CAPEX_equip)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPEX_civil" value={fmt(CAPEX_civil)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPEX_inst" value={fmt(CAPEX_inst)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPEX_eng" value={fmt(CAPEX_eng)} unit="$" info={INFO_MSH} />

                    <RowView label="CAPEX_total" value={fmt(CAPEX_total)} unit="$" info={INFO_MSH} />
                    <RowView label="CAPX_spec" value={fmt(CAPX_spec)} unit="$/(t/h)" info={INFO_MSH} />

                    <RowView label="CRF" value={fmt(CRF)} unit="-" info={INFO_MSH} />
                    <RowView label="Ucap" value={fmt(Ucap)} unit="$/t" info={INFO_MSH} />

                    {/* ===== SECOND OUTPUTS (OPEX) ===== */}
                    <div className="border-t border-gray-700 mt-4 pt-3">
                      <div className="text-sm font-semibold text-gray-400 mb-2">
                        Outputs
                      </div>
                        <RowView label="OPEX_sec" value={fmt(OPEX_sec)} unit="$/t" info={INFO_MSH} />
                        <RowView label="OPEX_elc" value={fmt(OPEX_elc)} unit="$/t" info={INFO_MSH} />
                        <RowView label="OPEX_anti" value={fmt(Cantiscalant)} unit="$/t" info={INFO_MSH} />
                        <RowView label="OPEX_acid" value={fmt(Cacid_dose)} unit="$/t" info={INFO_MSH} />

                        <RowView label="OPEX_labor" value={fmt(Clabor)} unit="$/t" info={INFO_MSH} />
                        <RowView label="OPEX_maint" value={fmt(Cmain_annual)} unit="$/t" info={INFO_MSH} />
                        <RowView label="OPEX_over" value={fmt(Cover_annual)} unit="$/t" info={INFO_MSH} />
                        <RowView label="OPEX_total" value={fmt(OPEX_total_with_overhead)} unit="$/t" info={INFO_MSH} />

                        <RowView label="UPC" value={fmt(UPC)} unit="$/t" info={INFO_MSH} />
                    </div>
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
