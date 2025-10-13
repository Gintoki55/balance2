import React, { useState, useEffect } from "react";
import { Play, ExternalLink } from "lucide-react";
import { runData, scenarioData, MEDFile, MSFFile, ROAFile } from "../data/allData";

const plantFiles = { MED: MEDFile, MSF: MSFFile, ROA: ROAFile };

const TopOptions = ({ station = "MSF", onOptionsChange }) => {
  const [selectedFile, setSelectedFile] = useState(plantFiles[station][0]);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [selectedRun, setSelectedRun] = useState("");

  // التحكم في حالات التفعيل
  const isFileDisabled = !selectedFile || selectedFile === "select"; // لو ما فيه ملف صالح
  const isScenarioDisabled = isFileDisabled;                        // يعتمد على الملف
  const isRunsDisabled = isScenarioDisabled || !selectedScenario;    // يعتمد على السيناريو

  useEffect(() => {
    if (onOptionsChange) {
      onOptionsChange({
        file: selectedFile,
        scenario: selectedScenario,
        run: selectedRun,
        disabled: isFileDisabled,
      });
    }
  }, [selectedFile, selectedScenario, selectedRun, isFileDisabled, onOptionsChange]);

  return (
    <div className="bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-around gap-4 sm:gap-6 w-full">
      
      {/* Plant File */}
      <div className="flex flex-col w-full sm:w-auto">
        <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">{station} File</span>
        <select
          value={selectedFile}
          onChange={(e) => {
            setSelectedFile(e.target.value);
            setSelectedScenario(""); // إعادة تعيين عند تغيير الملف
            setSelectedRun("");
          }}
          className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-green-50 transition w-full sm:w-auto"
        >
          {plantFiles[station].map((file, idx) => (
            <option key={idx} value={file}>{file}</option>
          ))}
        </select>
      </div>

      {/* Scenario */}
      <div className="flex flex-col w-full sm:w-auto">
        <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">Scenario</span>
        <select
          value={selectedScenario}
          onChange={(e) => setSelectedScenario(e.target.value)}
          disabled={isScenarioDisabled}
          className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-green-50 transition disabled:opacity-50 w-full sm:w-auto"
        >
          <option value="select">Select</option>
          {scenarioData.map((scenario, idx) => (
            <option key={idx} value={scenario}>{scenario}</option>
          ))}
        </select>
      </div>

      {/* Runs */}
      <div className="flex flex-col w-full sm:w-auto">
        <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">Runs</span>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRun}
            onChange={(e) => setSelectedRun(Number(e.target.value))}
            disabled={isRunsDisabled}
            className="px-3 py-1 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition disabled:opacity-50 w-full sm:w-auto"
          >
            {runData.map((run, idx) => (
              <option key={idx} value={run}>{run}</option>
            ))}
          </select>
          <button
            disabled={isRunsDisabled}
            className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Save to Dashboard */}
      <div className="flex flex-col w-full sm:w-auto">
        <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">Save to</span>
        <div className="flex w-full sm:w-auto hover:underline">
          <button
            className="flex items-center gap-3 text-blue-600 w-full sm:w-auto cursor-pointer disabled:opacity-50"
            disabled={isRunsDisabled}
          >
            Dashboard
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default TopOptions;
