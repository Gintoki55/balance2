"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedFile,
  setSelectedScenario,
  setJValue,
  resetStation,
  fetchSavedFiles,
  fetchFileData,
  runCalculationNow,
  saveProject,
} from "../../(data)/store/stationSlice";
import { runData, scenarioData } from "@/data/allData";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAnimate } from "../../(data)/animationContext";
export default function TopOptions({ station }) {
  const dispatch = useDispatch();
  const {
    selectedFile,
    selectedScenario,
    jValue,
    savedFiles,
    loadingFiles,
    stationData
  } = useSelector((state) => state.station);

  const [selectedRun, setSelectedRun] = useState("");
  const [selectedProject, setSelectedProject] = useState("project 1");
  const { triggerAnimation } = useAnimate();
  useEffect(() => {
    dispatch(fetchSavedFiles());
  }, [dispatch]);

  // جلب بيانات الملف عند تغييره
  useEffect(() => {
    if (selectedFile && selectedFile !== "New Plant" && selectedFile !== "select") {
      dispatch(fetchFileData(selectedFile));
    }
  }, [selectedFile, dispatch]);

  const handleSave = () => {
  dispatch(saveProject({
  fileName: selectedProject,
  selectedScenario,
  jValue,
  stationData
}));

  };

  return (
    <div className="bg-white p-4 relative">
      <Toaster position="top-center" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-4 sm:gap-6 w-full">
        {/* File */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 font-medium">{station} File</span>
          <select
            value={selectedFile}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "New Plant") {
                dispatch(resetStation());
                dispatch(setSelectedFile("New Plant"));
              } else {
                dispatch(setSelectedFile(val));
              }
            }}
            className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-green-50"
          >
            <option value="select">Select</option>
            <option value="New Plant">New Plant</option>
            {loadingFiles && <option disabled>Loading...</option>}
            {!loadingFiles &&
              savedFiles.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
          </select>
        </div>

        {/* Scenario */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 font-medium">Scenario</span>
          <select
            value={selectedScenario}
            onChange={(e) => dispatch(setSelectedScenario(e.target.value))}
            className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50 w-full sm:w-auto"
          >
            {scenarioData.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Runs */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
            Runs
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedRun}
              onChange={(e) => setSelectedRun(Number(e.target.value))}
              className="px-3 py-1 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition disabled:opacity-50 w-full sm:w-auto"
            >
              {runData.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                triggerAnimation();
                dispatch(runCalculationNow())
              }}
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
            Save to Project
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-1 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition w-full sm:w-auto"
            >
              {["project 1", "project 2", "project 3", "project 4", "project 5"].map(
                (p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                )
              )}
            </select>
            <button
              onClick={handleSave}
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition cursor-pointer text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
