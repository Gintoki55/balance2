"use client";

import { useState } from "react";
import StationHeader from "@/components/stationheader";
import One from "./component/one";
import Two from "./component/two";
import Three from "./component/three";
import Four from "./component/four";
import Five from "./component/five";
import Six from "./component/six";
import Seven from "./component/seven";
import Eight from "./component/eight";
import Nine from "./component/nine";

export default function CalculatorPage() {
  const [selected, setSelected] = useState("one");

  const renderComponent = () => {
    switch (selected) {
      case "one":
        return <One />;
      case "two":
        return <Two />;
      case "three":
        return <Three />;
      case "four":
        return <Four />;
      case "five":
        return <Five />;
      case "six":
        return <Six />;
      case "seven":
        return <Seven />;
      case "eight":
        return <Eight />;
      case "nine":
        return <Nine />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      <StationHeader title="Calculator" isPopup />

      <main className="flex-grow flex justify-center m-10">
        <div className="max-w-md w-full space-y-6">

          {/* ===== Dropdown ===== */}
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full p-3 border rounded-xl shadow-sm"
          >
            <option value="one">Temperature convertor T</option>
            <option value="two">Volume convertor V</option>
            <option value="three">Water flow convertor  M</option>
            <option value="four">Pressure convertor  P</option>
            <option value="five">Heat convertor  Q</option>
            <option value="six">RO water and salt permeation</option>
            <option value="seven">Salinity Calculations</option>
            <option value="eight">RO element parameters (pressure drop is given)</option>
            <option value="nine">RO Parameters (Correlated ΔP)</option>
          </select>

          {/* ===== Selected Table ===== */}
          <div>{renderComponent()}</div>

        </div>
      </main>
    </div>
  );
}
