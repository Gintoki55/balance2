"use client";

import Tooltip from "@/components/Tooltip";
import { Beaker, Gauge, FlaskConical, Thermometer } from "lucide-react";
import { useState } from "react";


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

  //one 
const INFO_1 = {
  "°C": "Celsius",
  K: "Kelvin",
  "°F": "Fahrenheit",
  "°R": "Rankine",
}


  //two 
const INFO_2 = {
  "m³": "Cubic meter",
  "IG": "Imperial gallon",
  "gl": "US Gallon",
  "ft³": "Cubic foot",
}
  //three 
const INFO_3 = {
  "MIGD": "Million imperial gallons per day",
  "m³/day": "Cubic meters per day",
  "t/h": "Tonnes per hour",
  "kg/s": "Kilograms per second",
}


  //Four 
const INFO_4 = {
  "bar": "bar",
  "kPa": "KiloPascal",
  "MPa": "megaPascal",
  "psi": "Pounds per square inch",
}
  //Five 
const INFO_5 = {
  "kWh": "Kilowatt hour",
  "MJ": "Megajoule",
  "kBTU": "Kilo British thermal unit",
  "kcal": "Kilocalorie",
}
  //Six 
const INFO_6 = {
  "°C": "Celcius",
  "µs/cm": "microsiemens per centimeter",
  "ppm": "parts per million",
  "g/l": "gram per liter",
  "%": "precent",
  "T": "Water temperature T",
  "EC": "Electrical conducitvity EC",
  // "S": "Salinity (Total desolved solid TDS)",
  "S": "Salinity",

}

const INFO_7 = {
  "T":"Water temperature",
  "S":"Salinity",
  "π":"Osmotic pressure",
  "°C":"Celsius",
  "g/l":"Grams per liter",
  "bar":"Bar",
  "Sf":"Feed salinity",
  "Sd":"Product salinity",
  "SR":"Salt rejection",
  "%":"Percent",

};


const INFO_8 = {
  "g/l": "gram per liter",
  "%": "percent",

  "S0": "Feed salinity",
  "Sb": "Brine salinity",
  "Sd": "Product salinity",
  "WR": "Water recovery",
};


const INFO_9 = {
  gfd: "Gallon per square foot per day",
  lmh: "liter per square meter per hour",
  mj: "Water flux"
};


const INFO_10 = {
  "l/m².h.bar": "Liter per square meter per hour per bar",
  "m/s.bar": "Meter per second per bar",
  "w": "Water Permeability"
};


const INFO_11 = {
  "°C": "Celsius",
  "MJ/t": "Megajoule per metric ton",
  h: "Specific enthalpy",
  T: "Water temperature",
  λ: "Latent heat of evaporation",
  Tv: "Vapor temperature",
  hv: "Specific enthalpy of saturated steam",
  hb: "Specific enthalpy of saline water",
  Sb: "Water salinity",
  Tb: "Saline water temperature",
  "g/l": "Grams per liter",
};

const INFO_12 = {
    "ΔT": "Brine temperature drop per stage",
    "Tv": "Saturated vapor temperature",
    "α": "Non-equilibrium allowance",
    "°C": "Celsius",
    "g/l": "Grams per liter",
    "S":"Water salinity",
    "β":"Boiling point elevation",
    "#":"Dimensionless",
    "0":"Temperature depression in demister and tube bundle",
    "cg":"Condensing gain"
};

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



  const allowNumber = (value, setter) => {
    if (/^-?\d*\.?\d*$/.test(value)) setter(value);
  };
  
  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };


// Temperature Converter
export function One() {
  const [celsius, setCelsius] = useState(0);
  const [kelvin, setKelvin] = useState(273.15);
  const [fahrenheit, setFahrenheit] = useState(32);
  const [rankine, setRankine] = useState(491.67);


  return (
    <div className="max-w-4xl mx-auto w-full space-y-3 my-5">
      <h2 className="text-xl font-bold text-gray-300">
        BDS Converter
      </h2>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Celsius */}
        <Section title="Temperature Converter [°C]">
          <RowInput
            label="T"
            unit="°C"
            value={celsius}
            onChange={(e) => allowNumber(e.target.value, setCelsius)}
            onBlur={() => formatOnBlur(celsius, setCelsius)}
            autoFocus
            info={INFO_1}
          />
          <RowView label="T" value={(Number(celsius) + 273.15).toFixed(4)} unit="K" info={INFO_1}/>
          <RowView label="T" value={(32 + 1.8 * Number(celsius)).toFixed(4)} unit="°F" info={INFO_1}/>
          <RowView label="T" value={((Number(celsius) + 273.15) * 9 / 5).toFixed(4)} unit="°R" info={INFO_1}/>
        </Section>

        {/* Kelvin */}
        <Section title="Temperature Converter [K]"> 
          <RowInput
            label="T"
            unit="K"
            value={kelvin}
            onChange={(e) => allowNumber(e.target.value, setKelvin)}
            onBlur={() => formatOnBlur(kelvin, setKelvin)}
            info={INFO_1}
          />
          <RowView label="T" value={(1.8 * Number(kelvin) - 459.67).toFixed(4)} unit="°F" info={INFO_1}/>
          <RowView label="T" value={(Number(kelvin) * 9 / 5).toFixed(4)} unit="°R" info={INFO_1}/>
          <RowView label="T" value={(Number(kelvin) - 273.15).toFixed(4)} unit="°C" info={INFO_1}/>
        </Section>

        {/* Fahrenheit */}
        <Section title="Temperature Converter [°F]">
          <RowInput
            label="T"
            unit="°F"
            value={fahrenheit}
            onChange={(e) => allowNumber(e.target.value, setFahrenheit)}
            onBlur={() => formatOnBlur(fahrenheit, setFahrenheit)}
            info={INFO_1}
          />
          <RowView label="T" value={(Number(fahrenheit) + 459.67).toFixed(4)} unit="°R" info={INFO_1}/>
          <RowView label="T" value={(((Number(fahrenheit) - 32) * 5) / 9).toFixed(4)} unit="°C" info={INFO_1}/>
          <RowView label="T" value={(((Number(fahrenheit) + 459.67) * 5) / 9).toFixed(4)} unit="K" info={INFO_1}/>
        </Section>

        {/* Rankine */}
        <Section title="Temperature Converter [°R]">
          <RowInput
            label="T"
            unit="°R"
            value={rankine}
            onChange={(e) => allowNumber(e.target.value, setRankine)}
            onBlur={() => formatOnBlur(rankine, setRankine)}
            info={INFO_1}
          />
          <RowView label="T" value={(Number(rankine) * 5 / 9 - 273.15 ).toFixed(4)} unit="°C" info={INFO_1}/>
          <RowView label="T" value={(Number(rankine) * 5 / 9 ).toFixed(4)} unit="K" info={INFO_1}/>
          <RowView label="T" value={(Number(rankine) - 459.67).toFixed(4)} unit="°F" info={INFO_1}/>
        </Section>

      </div>
    </div>
  );
}
// Volume Converter
export  function Two() {
const [cubicMeter, setCubicMeter] = useState(1);
const [cubicFoot, setCubicFoot] = useState(35.3147);
const [imperialGallon, setImperialGallon] = useState(220);
const [usGallon, setUsGallon] = useState(264.2);


return (
  <div className="max-w-4xl mx-auto w-full space-y-3 my-5">

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* m³ input */}
        <Section title="Volume Converter [M³]">
          <RowInput
            label="V"
            unit="m³"
            value={cubicMeter}
            onChange={(e) => allowNumber(e.target.value, setCubicMeter)}
            onBlur={() => formatOnBlur(cubicMeter, setCubicMeter)}
            autoFocus
            info={INFO_2}
          />
          <RowView label="V" value={(Number(cubicMeter) * 35.3147).toFixed(4)} unit="ft³" info={INFO_2}/>
          <RowView label="V" value={(Number(cubicMeter) * 220).toFixed(4)} unit="IG" info={INFO_2}/>
          <RowView label="V" value={(Number(cubicMeter) * 264.2).toFixed(4)} unit="gl" info={INFO_2}/>
        </Section>

        {/* ft³ input */}
        <Section title="Volume Converter [ft³]">
          <RowInput
            label="V"
            unit="ft³"
            value={cubicFoot}
            onChange={(e) => allowNumber(e.target.value, setCubicFoot)}
            onBlur={() => formatOnBlur(cubicFoot, setCubicFoot)}
            info={INFO_2}
          />
          <RowView label="V" value={(Number(cubicFoot) * 220 / 35.3147).toFixed(4)} unit="IG" info={INFO_2}/>
          <RowView label="V" value={(Number(cubicFoot) * 264.2 / 35.3147).toFixed(4)} unit="gl" info={INFO_2}/>
          <RowView label="V" value={(Number(cubicFoot) / 35.3147).toFixed(4)} unit="m³" info={INFO_2}/>
        </Section>

        {/* IG (UK) input */}
        <Section title="Volume Converter [IG]">
          <RowInput
            label="V"
            unit="IG"
            value={imperialGallon}
            onChange={(e) => allowNumber(e.target.value, setImperialGallon)}
            onBlur={() => formatOnBlur(imperialGallon, setImperialGallon)}
            info={INFO_2}
          />
          <RowView label="V" value={(Number(imperialGallon) * 264.2 / 220).toFixed(4)} unit="gl" info={INFO_2}/>
          <RowView label="V" value={(Number(imperialGallon) / 220).toFixed(4)} unit="m³" info={INFO_2}/>
          <RowView label="V" value={(Number(imperialGallon) * 35.3147 / 220).toFixed(4)} unit="ft³" info={INFO_2}/>
        </Section>

        {/* gl (US) input */}
        <Section title="Volume Converter [gl]">
          <RowInput
            label="V"
            unit="gl"
            value={usGallon}
            onChange={(e) => allowNumber(e.target.value, setUsGallon)}
            onBlur={() => formatOnBlur(usGallon, setUsGallon)}
            info={INFO_2}
          />
          <RowView label="V" value={(Number(usGallon) / 264.2).toFixed(4)} unit="m³" info={INFO_2}/>
          <RowView label="V" value={(Number(usGallon) * 35.3147 / 264.2).toFixed(4)} unit="ft³" info={INFO_2}/>
          <RowView label="V" value={(Number(usGallon) * 220 / 264.2).toFixed(4)} unit="IG" info={INFO_2}/>
        </Section>

      </div>

  </div>
);

}
// Water Flow Converter
export function Three() {
const [migd, setMigd] = useState(1);
const [cubicMeterPerDay, setCubicMeterPerDay] = useState(4545.45);
const [tonPerHour, setTonPerHour] = useState(189.39);
const [kgPerSecond, setKgPerSecond] = useState(52.61);

return (
  <div className="max-w-4xl mx-auto w-full space-y-3 my-5">
       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* MIGD */}
        <Section title="Water Flow Converter [MIGD]">
          <RowInput
            label="M"
            unit="MIGD"
            value={migd}
            onChange={(e) => allowNumber(e.target.value, setMigd)}
            onBlur={() => formatOnBlur(migd, setMigd)}
            autoFocus
            info={INFO_3}
          />
          <RowView label="M" value={((Number(migd) * 1_000_000) / 220).toFixed(4)} unit="m³/day" info={INFO_3}/>
          <RowView label="M" value={((Number(migd) * 1_000_000) / (220 * 24)).toFixed(4)} unit="t/h" info={INFO_3}/>
          <RowView label="M" value={((Number(migd) * 4_545_454) / 86400).toFixed(4)} unit="kg/s" info={INFO_3}/>
        </Section>

                {/* m³/day */}
        <Section title="Water Flow Converter [m³/day]">
          <RowInput
            label="M"
            unit="m³/day"
            value={cubicMeterPerDay}
            onChange={(e) => allowNumber(e.target.value, setCubicMeterPerDay)}
            onBlur={() => formatOnBlur(cubicMeterPerDay, setCubicMeterPerDay)}
            info={INFO_3}
          />
          <RowView label="M" value={((Number(cubicMeterPerDay) + 0.0001) / 24).toFixed(4)} unit="t/h" info={INFO_3}/>
          <RowView label="M" value={((Number(cubicMeterPerDay) * 1000) / 86400).toFixed(4)} unit="kg/s" info={INFO_3}/>
          <RowView label="M" value={((Number(cubicMeterPerDay) * 220) / 1_000_000).toFixed(4)} unit="MIGD" info={INFO_3}/>
        </Section>

        {/* t/h */}
        <Section title="Water Flow Converter [t/h]">
          <RowInput
            label="M"
            unit="t/h"
            value={tonPerHour}
            onChange={(e) => allowNumber(e.target.value, setTonPerHour)}
            onBlur={() => formatOnBlur(tonPerHour, setTonPerHour)}
            info={INFO_3}
          />
          <RowView label="M" value={((Number(tonPerHour) * 1000) / 3600).toFixed(4)} unit="kg/s" info={INFO_3}/>
          <RowView label="M" value={((Number(tonPerHour) * 24 * 220) / 1_000_000).toFixed(4)} unit="MIGD" info={INFO_3}/>
          <RowView label="M" value={(Number(tonPerHour) * 24).toFixed(4)} unit="m³/day" info={INFO_3}/>
        </Section>


        {/* kg/s */}
        <Section title="Water Flow Converter [kg/s]">
          <RowInput
            label="M"
            unit="kg/s"
            value={kgPerSecond}
            onChange={(e) => allowNumber(e.target.value, setKgPerSecond)}
            onBlur={() => formatOnBlur(kgPerSecond, setKgPerSecond)}
            info={INFO_3}
          />
          <RowView label="M" value={((Number(kgPerSecond) * 86400) / 4_545_454).toFixed(4)} unit="MIGD" info={INFO_3}/>
          <RowView label="M" value={((Number(kgPerSecond) * 86400) / 1000).toFixed(4)} unit="m³/day" info={INFO_3}/>
          <RowView label="M" value={((Number(kgPerSecond) * 3600) / 1000).toFixed(4)} unit="t/h" info={INFO_3}/>
        </Section>

  </div>
  </div>
);

}

// Pressure Converter
export function Four() {
const [bar, setBar] = useState(1);
const [kPa, setKPa] = useState(100);
const [megaPascal, setMegaPascal] = useState(0.1);
const [psi, setPsi] = useState(14.55);


return (
  <div className="max-w-4xl mx-auto w-full space-y-3 my-5">

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* bar */}
        <Section title="Pressure Converter [bar]">
          <RowInput
            label="P"
            unit="bar"
            value={bar}
            onChange={(e) => allowNumber(e.target.value, setBar)}
            onBlur={() => formatOnBlur(bar, setBar)}
            autoFocus
            info={INFO_4}
          />
          <RowView label="P" value={(Number(bar) * 100).toFixed(4)} unit="kPa" info={INFO_4}/>
          <RowView label="P" value={(Number(bar) / 10).toFixed(4)} unit="MPa" info={INFO_4}/>
          <RowView label="P" value={(Number(bar) * 14.55).toFixed(4)} unit="psi" info={INFO_4}/>
        </Section>

        {/* kPa */}
        <Section title="Pressure Converter [kPa]">
          <RowInput
            label="P"
            unit="kPa"
            value={kPa}
            onChange={(e) => allowNumber(e.target.value, setKPa)}
            onBlur={() => formatOnBlur(kPa, setKPa)}
            info={INFO_4}
          />
          <RowView label="P" value={(Number(kPa) / 1000).toFixed(4)} unit="MPa" info={INFO_4}/>
          <RowView label="P" value={(Number(kPa) * 0.1455).toFixed(4)} unit="psi" info={INFO_4}/>
          <RowView label="P" value={(Number(kPa) / 100).toFixed(4)} unit="bar" info={INFO_4}/>
        </Section>

        {/* MPa */}
        <Section title="Pressure Converter [MPa]">
          <RowInput
            label="P"
            unit="MPa"
            value={megaPascal}
            onChange={(e) => allowNumber(e.target.value, setMegaPascal)}
            onBlur={() => formatOnBlur(megaPascal, setMegaPascal)}
            info={INFO_4}
          />
          <RowView label="P" value={(Number(megaPascal) * 145.5).toFixed(4)} unit="psi" info={INFO_4}/>
          <RowView label="P" value={(Number(megaPascal) * 10).toFixed(4)} unit="bar" info={INFO_4}/>
          <RowView label="P" value={(Number(megaPascal) * 1000).toFixed(4)} unit="kPa" info={INFO_4}/>
        </Section>

        {/* psi */}
        <Section title="Pressure Converter [psi]">
          <RowInput
            label="P"
            unit="psi"
            value={psi}
            onChange={(e) => allowNumber(e.target.value, setPsi)}
            onBlur={() => formatOnBlur(psi, setPsi)}
            info={INFO_4}
          />
          <RowView label="P" value={(Number(psi) / 14.55).toFixed(4)} unit="bar" info={INFO_4}/>
          <RowView label="P" value={(Number(psi) / 0.1455).toFixed(4)} unit="kPa" info={INFO_4}/>
          <RowView label="P" value={(Number(psi) / 145.5).toFixed(4)} unit="MPa" info={INFO_4}/>
        </Section>

      </div>

  </div>
);

}

// Heat Converter
export function Five() {
const [kWh, setkWh] = useState(1);
const [MJ, setMJ] = useState(1);
const [kBTU, setkBTU] = useState(1);
const [kcal, setkcal] = useState(1000);

return (
  <div className="max-w-4xl mx-auto w-full space-y-3 my-5">

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* kWh */}
        <Section title="Heat Converter [kWh]">
          <RowInput
            label="Q"
            unit="kWh"
            value={kWh}
            onChange={(e) => allowNumber(e.target.value, setkWh)}
            onBlur={() => formatOnBlur(kWh, setkWh)}
            autoFocus
            info={INFO_5}
          />
          <RowView label="Q" value={(3.6 * Number(kWh)).toFixed(4)} unit="MJ" info={INFO_5}/>
          <RowView label="Q" value={(3.41232 * Number(kWh)).toFixed(4)} unit="kBTU" info={INFO_5}/>
          <RowView label="Q" value={(860.01 * Number(kWh)).toFixed(4)} unit="kcal" info={INFO_5}/>
        </Section>

        {/* MJ */}
        <Section title="Heat Converter [MJ]">
          <RowInput
            label="Q"
            unit="MJ"
            value={MJ}
            onChange={(e) => allowNumber(e.target.value, setMJ)}
            onBlur={() => formatOnBlur(MJ, setMJ)}
            info={INFO_5}
          />
          <RowView label="Q" value={(0.9479 * Number(MJ)).toFixed(4)} unit="kBTU" info={INFO_5}/>
          <RowView label="Q" value={(238.892 *  Number(MJ)).toFixed(4)} unit="kcal" info={INFO_5}/>
          <RowView label="Q" value={( Number(MJ) / 3.6).toFixed(4)} unit="kWh" info={INFO_5}/>
        </Section>

        {/* kBTU */}
        <Section title="Heat Converter [kBTU]">
          <RowInput
            label="Q"
            unit="kBTU"
            value={kBTU}
            onChange={(e) => allowNumber(e.target.value, setkBTU)}
            onBlur={() => formatOnBlur(kBTU, setkBTU)}
            info={INFO_5}
          />
          <RowView label="Q" value={(252.031 * Number(kBTU)).toFixed(4)} unit="kcal" info={INFO_5}/>
          <RowView label="Q" value={(0.2931 * Number(kBTU)).toFixed(4)} unit="kWh" info={INFO_5}/>
          <RowView label="Q" value={(1.055 * Number(kBTU)).toFixed(4)} unit="MJ" info={INFO_5}/>
        </Section>

        {/* kcal */}
        <Section title="Heat Converter [kcal]">
          <RowInput
            label="Q"
            unit="kcal"
            value={kcal}
            onChange={(e) => allowNumber(e.target.value, setkcal)}
            onBlur={() => formatOnBlur(kcal, setkcal)}
            info={INFO_5}
          />
          <RowView label="Q" value={(Number(kcal) / 860.01).toFixed(4)} unit="kWh" info={INFO_5}/>
          <RowView label="Q" value={((Number(kcal) * 3.6) / 860.01).toFixed(4)} unit="MJ" info={INFO_5}/>
          <RowView label="Q" value={((Number(kcal) * 3.41232) / 860.01).toFixed(4)} unit="kBTU" info={INFO_5}/>
        </Section>

      </div>

  </div>
);

}

// Electrical Conductivity Converter && Salinity Convertor
export function Six() {
  const [temperature, setTemperature] = useState(30);
  const [conductivity, setConductivity] = useState(6000);
  const [salinityPPM, setSalinityPPM] = useState(35000);

  /* ===== Salinity From T & EC ===== */
    const T = Number(temperature);
    const EC = Number(conductivity);

    const ecAdj = EC * (1 + 0.022 * (25 - T))

    const result = ecAdj * (
    0.5 + 
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 100) / (ecAdj - 100.0001)) +
    0.1 * (0.5 + 0.5 * Math.abs(ecAdj - 1000) / (ecAdj - 1000.0001)) +
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 40000) / (ecAdj - 40000.0001)) +
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 60000) / (ecAdj - 60000.0001))
  )

  const calculatedPPM = Number(result).toFixed(4);


  return (
    <div className="max-w-4xl mx-auto w-full space-y-3 my-5">
      {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Electrical Conductivity Converter">
                <RowInput
                    label="T"
                    unit="°C"
                    value={temperature}
                    onChange={(e) => allowNumber(e.target.value, setTemperature)}
                    onBlur={() => formatOnBlur(temperature, setTemperature)}
                    autoFocus
                    info={INFO_6}
                />

                <RowInput
                    label="EC"
                    unit="µs/cm"
                    value={conductivity}
                    onChange={(e) => allowNumber(e.target.value, setConductivity)}
                    onBlur={() => formatOnBlur(conductivity, setConductivity)}
                    autoFocus
                    info={INFO_6}
                />

                <RowView label="S" unit="ppm" value={calculatedPPM} info={INFO_6}/>
                </Section> 


            <Section title="Salinity Convertor">
                <RowInput
                    label="S"
                    unit="ppm"
                    value={salinityPPM}
                    onChange={(e) => allowNumber(e.target.value, setSalinityPPM)}
                    onBlur={() => formatOnBlur(salinityPPM, setSalinityPPM)}
                    autoFocus
                    info={INFO_6}
                />

                <RowView
                    label="S"
                    unit="g/l"
                    value={(Number(salinityPPM) / 1000).toFixed(4)}
                    info={INFO_6}
                />

                <RowView
                    label="S"
                    unit="%"
                    value={(Number(salinityPPM) / 10000).toFixed(4)}
                    info={INFO_6}
                />
                </Section> 
      </div>
    </div>
  );
}


// Osmotic Pressure Converter && Salt Rejection
export function Seven() {
  const [T, setT] = useState(30);
  const [S, setS] = useState(50);

  const pi = 0.00255 * (273 + T) * S;
  
  const [Sf, setSf] = useState(65);
  const [Sd, setSd] = useState(0.2);

  const SR = 100 * (Sf - Sd) / Sf;


  return (
    <div className="max-w-4xl mx-auto w-full space-y-3 my-5">
      <div className="text-gray-300 px-4 font-semibold flex items-center gap-2">
         <FlaskConical className="w-4 h-4" />
        <span className="text-base">
         RO Variables
        </span>
      </div>
      {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Osmotic Pressure Converter">
                <RowInput
                    label="T"
                    unit="°C"
                    value={T}
                    onChange={(e) => allowNumber(e.target.value, setT)}
                    onBlur={() => formatOnBlur(T, setT)}
                    autoFocus
                    info={INFO_7}
                />

                <RowInput
                    label="S"
                    unit="g/l"
                    value={S}
                    onChange={(e) => allowNumber(e.target.value, setS)}
                    onBlur={() => formatOnBlur(S, setS)}
                    autoFocus
                    info={INFO_7}
                />

                <RowView label="π" unit="bar" value={pi} info={INFO_7}/>
                </Section> 


            <Section title="Salt Rejection">
                <RowInput
                    label="Sf"
                    unit="g/l"
                    value={Sf}
                    onChange={(e) => allowNumber(e.target.value, setSf)}
                    onBlur={() => formatOnBlur(Sf, setSf)}
                    autoFocus
                    info={INFO_7}
                />

                <RowInput
                    label="Sd"
                    unit="g/l"
                    value={Sd}
                    onChange={(e) => allowNumber(e.target.value, setSd)}
                    onBlur={() => formatOnBlur(Sd, setSd)}
                    autoFocus
                    info={INFO_7}
                />

                <RowView
                    label="SR"
                    unit="%"
                    value={Number(SR).toFixed(4)}
                    info={INFO_7}
                />
                </Section> 
      </div>
    </div>
  );
}


// Water Recovery && Brine Salinity
export function Eight() {


  /* ===== Card 1 (Calculate WR) ===== */
  const [rawSalinityCalc, setRawSalinityCalc] = useState(40);
  const [brineSalinityCalc, setBrineSalinityCalc] = useState(65);
  const [productSalinityCalc, setProductSalinityCalc] = useState(0.2);

    /* ===== Card 2 (Calculate Sb) ===== */
  const [waterRecoveryInput, setWaterRecoveryInput] = useState(38.58);
  const [rawSalinityInput, setRawSalinityInput] = useState(40);
  const [productSalinityInput, setProductSalinityInput] = useState(0.2);

  const formatOnBlur = (value, setter) => {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (!isNaN(n)) setter(String(n));
  };

  const formatNumber = (num, digits = 4) => {
    if (num === "-" || num === "" || num === null || num === undefined)
      return "-";
    const n = Number(num);
    if (isNaN(n)) return "-";
    return n.toFixed(digits);
  };

  /* ===== Calculate WR from S0, Sb, Sd ===== */
  const WR =
    formatNumber(
            (100 * (Number(brineSalinityCalc) - Number(rawSalinityCalc))) /
              (Number(brineSalinityCalc) - Number(productSalinityCalc) || 1),
            4
          )

const Sb =
  formatNumber(
          (100 * Number(rawSalinityInput) -
            Number(waterRecoveryInput) * Number(productSalinityInput)) /
          (100 - Number(waterRecoveryInput))
        )

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ===== Card 1 ===== */}
        <Section title="Water Recovery">
          <RowInput
            label="S0"
            unit="g/l"
            value={rawSalinityCalc}
            onChange={(e) => allowNumber(e.target.value, setRawSalinityCalc)}
            onBlur={() => formatOnBlur(rawSalinityCalc, setRawSalinityCalc)}
            autoFocus
            info={INFO_8}
          />

          <RowInput
            label="Sb"
            unit="g/l"
            value={brineSalinityCalc}
            onChange={(e) => allowNumber(e.target.value, setBrineSalinityCalc)}
            onBlur={() => formatOnBlur(brineSalinityCalc, setBrineSalinityCalc)}
            autoFocus
            info={INFO_8}
          />

          <RowInput
            label="Sd"
            unit="g/l"
            value={productSalinityCalc}
            onChange={(e) => allowNumber(e.target.value, setProductSalinityCalc)}
            onBlur={() => formatOnBlur(productSalinityCalc, setProductSalinityCalc)}
            autoFocus
            info={INFO_8}
          />

          <RowView label="WR" unit="%" value={WR} info={INFO_8}/>
        </Section>

          {/* ===== Card 2 ===== */}

         <Section title="Brine Salinity">
          <RowInput
            label="WR"
            unit="%"
            value={waterRecoveryInput}
            onChange={(e) => allowNumber(e.target.value, setWaterRecoveryInput)}
            onBlur={() => formatOnBlur(waterRecoveryInput, setWaterRecoveryInput)}
            autoFocus
            info={INFO_8}
          />

          <RowInput
            label="S0"
            unit="g/l"
            value={rawSalinityInput}
            onChange={(e) => allowNumber(e.target.value, setRawSalinityInput)}
            onBlur={() => formatOnBlur(rawSalinityInput, setRawSalinityInput)}
            autoFocus
            info={INFO_8}
          />

          <RowInput
            label="Sd"
            unit="g/l"
            value={productSalinityInput}
            onChange={(e) => allowNumber(e.target.value, setProductSalinityInput)}
            onBlur={() => formatOnBlur(productSalinityInput, setProductSalinityInput)}
            autoFocus
            info={INFO_8}
          />

          <RowView
            label="Sb"
            unit="g/l"
            value={Sb}
            info={INFO_8}
          />
        </Section>

      </div>
    </div>
  );
}


// Water Flux Converter [gfd] && Water Flux Converter [lmh]
export function Nine() {
  const [mGfd, setMGfd] = useState(20);
  const [mLmh, setMLmh] = useState(33.94);

  const nGfd = mGfd === "" || mGfd === "-" ? null : Number(mGfd);
  const nLmh = mLmh === "" || mLmh === "-" ? null : Number(mLmh);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3 my-5">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Section title="Water Flux Converter [gfd]">
          <RowInput
            label="mj"
            unit="gfd"
            value={mGfd}
            onChange={(e) => allowNumber(e.target.value, setMGfd)}
            onBlur={() => formatOnBlur(mGfd, setMGfd)}
            info={INFO_9}
          />

          <RowView
            label="mj"
            value={((nGfd * 3.785 * 10.76) / 24).toFixed(4)}
            unit="lmh"
            info={INFO_9}
          />
        </Section>

        <Section title="Water Flux Converter [lmh]">
          <RowInput
            label="mj"
            unit="lmh"
            value={mLmh}
            onChange={(e) => allowNumber(e.target.value, setMLmh)}
            onBlur={() => formatOnBlur(mLmh, setMLmh)}
            info={INFO_9}
          />

          <RowView
            label="mj"
            value={(nLmh * 24 / (3.785 * 10.76)).toFixed(4)}
            unit="gfd"
            info={INFO_9}
          />
        </Section>

      </div>
    </div>
  );
}
// Water Permeability [l/m².h.bar] && Water Permeability [m/s.bar]

export function Ten() {
  const [wLmhBar, setWLmhBar] = useState(0.962);
  const [wMsBar, setWMsBar] = useState(2.672e-7);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Section title="Water Permeability [l/m².h.bar]">
          <RowInput
            label="w"
            unit="l/m².h.bar"
            value={wLmhBar}
            onChange={(e) => allowNumber(e.target.value, setWLmhBar)}
            onBlur={() => formatOnBlur(wLmhBar, setWLmhBar)}
            info={INFO_10}
          />

          <RowView
            label="w"
            value={(wLmhBar / (3600 * 1000)).toExponential(4).replace("e","E")}
            unit="m/s.bar"
            info={INFO_10}
          />
        </Section>

        <Section title="Water Permeability [m/s.bar]">
          <RowInput
            label="w"
            unit="m/s.bar"
            value={wMsBar}
            onChange={(e) => allowNumber(e.target.value, setWMsBar)}
            onBlur={() => formatOnBlur(wMsBar, setWMsBar)}
            info={INFO_10}
            
          />

          <RowView
            label="w"
            value={(wMsBar * (3600 * 1000)).toFixed(4)
            }
            unit="l/m².h.bar"
            info={INFO_10}
          />
        </Section>

      </div>
    </div>
  );
}


// Specific Enthalpy of Liquid Water && Latent Heat of Evaporation && Specific Enthalpy of Saturation Vapor && Specific Enthalpy of Saline Water

export function Elven() {
const [Celsius1, setCelsius1] = useState(50);
const [Celsius2, setCelsius2] = useState(50);
const [Celsius3, setCelsius3] = useState(50);
const [Celsius4, setCelsius4] = useState(50);
const [S, setS] = useState(70);



  const hs =
    4.18 * Celsius4 -
    0.034 +
    0.01 * (1.1 - 0.54 * Celsius4 + 56e-5 * Math.pow(Celsius4, 2)) * S -
    1e-4 * (4 - 0.016 * Celsius4 + 18e-5 * Math.pow(Celsius4, 2)) * Math.pow(S, 2);


return (
  <div className="max-w-4xl mx-auto w-full space-y-3 my-5">
    <div className="text-gray-300 px-4 font-semibold flex items-center gap-2">
         <Gauge className="w-4 h-4" />
        <span className="text-base">
         Thermal Variables
        </span>
      </div>

       {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Celsius1 */}
        <Section title="Specific Enthalpy of Liquid Water">
          <RowInput
            label="T"
            unit="°C"
            value={Celsius1}
            onChange={(e) => allowNumber(e.target.value, setCelsius1)}
            onBlur={() => formatOnBlur(Celsius1, setCelsius1)}
            autoFocus
            info={INFO_11}
          />
          <RowView label="h" value={( 4.18 * Celsius1 - 0.034 ).toFixed(4)} unit="MJ/t" info={INFO_11}/>
        </Section>

        {/* Celsius2 */}
        <Section title="Latent Heat of Evaporation">
          <RowInput
            label="T"
            unit="°C"
            value={Celsius2}
            onChange={(e) => allowNumber(e.target.value, setCelsius2)}
            onBlur={() => formatOnBlur(Celsius2, setCelsius2)}
            info={INFO_11}
          />
          <RowView label="λ" value={(2501.7 - 2.18 * Celsius2 - 77e-7 * Math.pow(Celsius2, 3) ).toFixed(4)} unit="MJ/t" info={INFO_11}/>
        </Section>

        {/* Celsius3 */}
        <Section title="Specific Enthalpy of Saturation Vapor">
          <RowInput
            label="Tv"
            unit="°C"
            value={Celsius3}
            onChange={(e) => allowNumber(e.target.value, setCelsius3)}
            onBlur={() => formatOnBlur(Celsius3, setCelsius3)}
            info={INFO_11}
          />
          <RowView label="hv" value={( 2501.7 - 1.8 * Celsius3 - 77e-7 * Math.pow(Celsius3, 3)).toFixed(4)} unit="MJ/t" info={INFO_11}/>
        </Section>

        

        {/* Celsius4 */}
        <Section title="Specific Enthalpy of Saline Water">
          <RowInput
            label="Tb"
            unit="°C"
            value={Celsius4}
            onChange={(e) => allowNumber(e.target.value, setCelsius4)}
            onBlur={() => formatOnBlur(Celsius4, setCelsius4)}
            info={INFO_11}
          />
          <RowInput
            label="Sb"
            unit="g/l"
            value={S}
            onChange={(e) => allowNumber(e.target.value, setS)}
            onBlur={() => formatOnBlur(S, setS)}
            info={INFO_11}
          />
          <RowView label="hb" value={hs.toFixed(4)} unit="MJ/t" info={INFO_11}/>
        </Section>

      </div>

  </div>
);

}


// Non-Equilibrium Temperature Diff. && Boiling Point Elevation. && Temperature Depression (Demister) && Condensing Gain

export function Twelve() {

// Table 1 (Non-Equilibrium)
const [deltaT, setDeltaT] = useState(3); // ΔT
const [tv_ne, setTv_ne] = useState(50);   // Tv

// Table 2 (Boiling Point)
const [tv_bpe, setTv_bpe] = useState(50); // Tv
const [salinity, setSalinity] = useState(70); // S

// Table 3 (Demister)
const [tv_demister, setTv_demister] = useState(50); // Tv

// Table 4 (Condensing Gain)
const [tv_condensing, setTv_condensing] = useState(50); // Tv


return (
  <div className="max-w-4xl mx-auto w-full space-y-3 my-5">
    <h2 className="text-xl font-bold text-gray700">
      {/* Heat Converter */}
    </h2>
{/* ===== Grid Cards ===== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* ===== Table 1 ===== */}
  <Section title="Non-Equilibrium Temperature Diff.">
    <RowInput
      label="ΔT"
      unit="°C"
      value={deltaT}
      onChange={(e) => allowNumber(e.target.value, setDeltaT)}
      onBlur={() => formatOnBlur(deltaT, setDeltaT)}
      info={INFO_12}
    />
    <RowInput
      label="Tv"
      unit="°C"
      value={tv_ne}
      onChange={(e) => allowNumber(e.target.value, setTv_ne)}
      onBlur={() => formatOnBlur(tv_ne, setTv_ne)}
      info={INFO_12}
    />
    <RowView
      label="α"
      value={(deltaT * Math.pow(0.98, tv_ne)).toFixed(4)}
      unit="°C"
      info={INFO_12}
    />
  </Section>

  {/* ===== Table 2 ===== */}
  <Section title="Boiling Point Elevation">
    <RowInput
      label="Tv"
      unit="°C"
      value={tv_bpe}
      onChange={(e) => allowNumber(e.target.value, setTv_bpe)}
      onBlur={() => formatOnBlur(tv_bpe, setTv_bpe)}
      info={INFO_12}
    />
    <RowInput
      label="S"
      unit="g/l"
      value={salinity}
      onChange={(e) => allowNumber(e.target.value, setSalinity)}
      onBlur={() => formatOnBlur(salinity, setSalinity)}
      info={INFO_12}
    />
    <RowView
      label="β"
      value={((0.0083 + 19e-6 * tv_bpe + 4e-7 * Math.pow(tv_bpe, 2)) * salinity).toFixed(4)}
      unit="°C"
      info={INFO_12}
    />
  </Section>
  {/* ===== Table 3 ===== */}
  <Section title="Temperature Depression (Demister)">
    <RowInput
      label="Tv"
      unit="°C"
      value={tv_demister}
      onChange={(e) => allowNumber(e.target.value, setTv_demister)}
      onBlur={() => formatOnBlur(tv_demister, setTv_demister)}
      info={INFO_12}
    />
    <RowView
      label="0"
      value={(1.89 * Math.exp(-0.037 * tv_demister)).toFixed(4)}
      unit="°C"
      info={INFO_12}
    />
  </Section>
  {/* ===== Table 4 ===== */}
  <Section title="Condensing Gain">
    <RowInput
      label="Tv"
      unit="°C"
      value={tv_condensing}
      onChange={(e) => allowNumber(e.target.value, setTv_condensing)}
      onBlur={() => formatOnBlur(tv_condensing, setTv_condensing)}
      info={INFO_12}
    />
    <RowView
      label="cg"
      value={(1 * Math.exp(-0.00015 * tv_condensing)).toFixed(4)}
      unit="#"
      info={INFO_12}
    />
  </Section>

  </div>

</div>
);

}
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
    <h2 className="text-xl font-bold text-gray700">
      {/* Heat Converter */}
    </h2>
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


export function Fourteen() {

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
  
const inputData = [
  { symbol: "Inputs", value: "", unit: "" },
   { symbol: "Th1", value: Th1_3, unit: "°C" },
  { symbol: "Th2", value: Th2, unit: "°C" },
  { symbol: "Tc1", value: Tc1, unit: "°C" },
  { symbol: "Tc2", value: Tc2_3, unit: "°C" },
  { symbol: "Q", value: Q, unit: "MJ/h" },
  { symbol: "A", value: A, unit: "m²" },
  { symbol: "Ucorr", value: Ur, unit: "MJ/m².h.°C" },
];

const outputData = [
  { symbol: "Outputs", value: "", unit: "" },
  { symbol: "LMTD", value: lmtd, unit: "°C" },
  { symbol: "U", value: Ut, unit: "MJ/m².h.°C" },
  { symbol: "K", value: K, unit: "#" },
];

// 🔹 PDF
const exportPDF = () => {
  const doc = new jsPDF();

  // 🔹 عنوان
  doc.setFontSize(16);
  doc.text("Heat Transfer Correction Factor K (By Testing)", 10, 15);

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
  doc.save("Heat_Transfer_Testing.pdf");
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
  XLSX.writeFile(wb, "Heat_Transfer_Data.xlsx");
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



const inputData_2 = [
  { symbol: "Inputs", value: "", unit: "" },
{ symbol: "ho", value: ho, unit: "MJ/m².h.°C" },
{ symbol: "FFo", value: FFo, unit: "m².h.°C/MJ" },
{ symbol: "δ", value: delta, unit: "m" },
{ symbol: "k", value: k, unit: "MJ/m.h.°C" },
{ symbol: "σ", value: sigma, unit: "#" },
{ symbol: "FFi", value: FFi, unit: "m².h.°C/MJ" },
{ symbol: "hi", value: hi, unit: "MJ/m².h.°C" },
{ symbol: "Ucorr", value: Ur2, unit: "MJ/m².h.°C" },
];

const outputData_2 = [
  { symbol: "Outputs", value: "", unit: "" },
  { symbol: "U", value: Uth, unit: "MJ/m².h.°C" },
  { symbol: "K", value: K2, unit: "#" },
];

const exportPDF_2 = () => {
  const doc = new jsPDF();

  // 🔹 عنوان
  doc.setFontSize(16);
  doc.text("Heat Transfer Correction Factor K (By Theory)", 10, 15);

  // 🔹 دالة تنسيق الأرقام
  const formatValue = (val) => {
    if (val === "" || val === null || val === undefined) return "";
    if (typeof val === "number") return val.toFixed(4);
    return val;
  };

  // ===== Inputs =====
  const inputRows = inputData_2
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
  const outputRows = outputData_2
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
  doc.save("Heat_Transfer_Theory.pdf");
};

// 🔹 Excel
  const exportExcel_2 = () => {
   const wb = XLSX.utils.book_new();

  // 🟢 Sheet 1 (Inputs)
  const wsInputs = XLSX.utils.json_to_sheet(inputData_2);

  // ✅ هنا تحطها
  wsInputs["!cols"] = [
    { wch: 10 }, // symbol
    { wch: 15 }, // value
    { wch: 15 }, // unit
  ];

  XLSX.utils.book_append_sheet(wb, wsInputs, "Inputs");

  // 🔵 Sheet 2 (Outputs)
  const wsOutputs = XLSX.utils.json_to_sheet(outputData_2);

  // ✅ وهنا أيضاً
  wsOutputs["!cols"] = [
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, wsOutputs, "Outputs");

  // 💾 حفظ الملف
  XLSX.writeFile(wb, "Heat_Transfer_Data.xlsx");
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
<Section title="Heat Transfer Correction Factor K (By Testing)">
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


{/* ===== Table 4 ===== */}
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

  <div className="flex gap-2 mt-3">
        <button
          onClick={exportPDF_2}
          className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded cursor-pointer"
        >
          PDF
        </button>

        <button
          onClick={exportExcel_2}
          className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded cursor-pointer"
        >
          Excel
        </button>

        <button
          onClick={resetToDefault_2}
          className="px-3 py-1 text-[#6ea8cc] bg-gray-100 rounded ml-auto cursor-pointer"
        >
          ↺ Reset
        </button>
      </div>

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