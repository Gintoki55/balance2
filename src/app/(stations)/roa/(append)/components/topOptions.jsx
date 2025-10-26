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
  fetchDashboards,
  saveDashboard
} from "../../../../store/stationSlice";
import { runData, scenarioData } from "@/data/allData";
import { Play, Loader, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAnimate } from "../../(data)/animationContext";
export default function TopOptions({ station }) {
  const dispatch = useDispatch();
  const {
    selectedFile,
    selectedScenario,
    savedFiles,
    loadingFiles,
    stationData,
    isRunning,
    dashboardSaveLoading,
    loadingDashboard,
    dashboards
  } = useSelector((state) => state.station);

  const [selectedRun, setSelectedRun] = useState("");
  const [selectedProject, setSelectedProject] = useState("project 1");
  const [selectedDashboard, setSelectedDashboard] = useState("New Dashboard");

  const [selectedExport, setSelectedExport] = useState("device");
  const [selectedAdmin, setSelectedAdmin] = useState("control");

  const { triggerAnimation } = useAnimate();
  const projectObject = [
    "project 1",
    "project 2",
    "project 3",
    "project 4",
    "project 5",
    "plant 1",
    "plant 2",
    "plant 3",
    "plant 4",
    "plant 5",
    "plant 6",
    "plant 7",
    "plant 8",
    "plant 9",
    "plant 10",
    "plant 11",
    "plant 12",
    "plant 13",
    "plant 14",
    "plant 15",
    "plant 16",
    "plant 17",
    "plant 18",
    "plant 19",
    "plant 20",
  ]

  // جلب الملفات
  useEffect(() => {
    dispatch(fetchSavedFiles());
  }, [dispatch]);
  
  // جلب داشبورد
  useEffect(() => {
  dispatch(fetchDashboards());
}, [dispatch]);

  // جلب بيانات الملف عند تغييره
  useEffect(() => {
    if (
      selectedFile &&
      selectedFile !== "New Plant" &&
      selectedFile !== "select"
    ) {
      dispatch(fetchFileData(selectedFile));
    }
  }, [selectedFile, dispatch]);


  const handleSaveDashboard = () => {
    dispatch(saveDashboard({ selectedDashboard, stationData }));
  };

  const handleSave = () => {
    dispatch(
      saveProject({
        fileName: selectedProject,
        selectedScenario,
        stationData,
      })
    );
  };

  return (
    <div className="bg-white p-4 relative flex flex-col gap-2">
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
            <option value="select">open</option>
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
                dispatch(runCalculationNow());
                triggerAnimation();
              }}
              disabled={isRunning}
              className={`flex items-center justify-center px-6 py-2 rounded-lg shadow active:scale-95 transition cursor-pointer text-white ${
                isRunning ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRunning ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Save Project */}
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
              {projectObject.map(
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
      <div className="w-full flex justify-center items-center">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-12 sm:w-[900px] max-sm:w-full ">
         {/* ✅ Dashboard Section */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
            Dashboard
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedDashboard}
              onChange={(e) => setSelectedDashboard(e.target.value)}
              className="px-3 py-1 border border-purple-600 rounded-lg text-purple-600 hover:bg-purple-50 transition w-full sm:w-auto"
            >
              <option value="New Dashboard">New Dashboard</option>

              {loadingDashboard ? (
                // ⏳ أثناء التحميل
                <option disabled>Loading...</option>
              ) : dashboards.length > 0 ? (
                // ✅ بعد التحميل ووجود Dashboards (مع إزالة التكرار)
                [...new Map(dashboards.map((d) => [d.name || d, d]))].map(([key, d]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))
              ) : (
                // ❌ بعد التحميل ولا يوجد Dashboards
                <option disabled>No dashboards found</option>
              )}
            </select>
            <button
              onClick={handleSaveDashboard}
              disabled={dashboardSaveLoading}
              className={`flex items-center justify-center px-6 py-2 rounded-lg shadow active:scale-95 transition cursor-pointer text-white ${
                dashboardSaveLoading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {dashboardSaveLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

         {/* ✅ Export To Section */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
            Export To
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedExport || "device"}
              onChange={(e) => setSelectedExport(e.target.value)}
              className="px-3 py-1 border border-orange-600 rounded-lg text-orange-600 hover:bg-orange-50 transition w-full sm:w-auto"
            >
              <option value="device">Device</option>
              <option value="excel">As Excel</option>
              <option value="pdf">As PDF</option>
            </select>

            <button
              onClick={() => console.log("Export:", selectedExport)}
              className="flex items-center justify-center px-6 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 active:scale-95 transition cursor-pointer text-sm"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ✅ Admin Section */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
            Admin
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedAdmin || "control"}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="px-3 py-1 border border-red-600 rounded-lg text-red-600 hover:bg-red-50 transition w-full sm:w-auto"
            >
              <option value="control">Control</option>
              <option value="subscription">Subscription</option>
              <option value="users">Users</option>
              <option value="experts">Experts</option>
              <option value="institutions">Institutions</option>
            </select>

            <button
              onClick={() => console.log("Admin Action:", selectedAdmin)}
              className="flex items-center justify-center px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 active:scale-95 transition cursor-pointer text-sm"
            >
            <Play className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}


  