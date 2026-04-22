"use client";

import Tooltip from "@/components/Tooltip";
import { Droplets, Info, Calculator, FlaskRound,FlaskConical, DollarSign ,Thermometer, AirVent, Flame} from "lucide-react";
import { useState, useRef } from "react";


import jsPDF from "jspdf";
import { toPng } from "html-to-image";

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
  "w": "Water Permeability",
  "x":"Salt permeability",
  "m/s":"Meters per second",
  "g/m².h.(g/l)":"Grams per square meter per hour per g/l"
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
      <div className="text-gray-300 px-4 font-semibold flex items-center gap-2">
         <Calculator className="w-4 h-4" />
        <span className="text-base">
         BDS Converter
        </span>
      </div>

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


export function Ten_s(){
  const [GMH, setGMH] = useState(0.0731);
  const [MS, setMS] = useState(2.03e-8);


   return (
    <div className="max-w-4xl mx-auto w-full space-y-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Section title="Salt Permeability [g/m².h.(g/l)]">
          <RowInput
            label="x"
            unit="g/m².h.(g/l)"
            value={GMH}
            onChange={(e) => allowNumber(e.target.value, setGMH)}
            onBlur={() => formatOnBlur(GMH, setGMH)}
            info={INFO_10}
          />

          <RowView
            label="x"
            value={(GMH / 3.6e6).toExponential(4).replace("e","E")}
            unit="m/s"
            info={INFO_10}
          />
        </Section>

        <Section title="Salt Permeability [m/s]">
          <RowInput
            label="x"
            unit="m/s"
            value={MS}
            onChange={(e) => allowNumber(e.target.value, setMS)}
            onBlur={() => formatOnBlur(MS, setMS)}
            info={INFO_10}
            
          />

          <RowView
            label="x"
            value={(MS * 3.6e6).toFixed(4)
            }
            unit="g/m².h.(g/l)"
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
         <FlaskRound className="w-4 h-4" />
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