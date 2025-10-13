"use client";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedFile, setSelectedScenario, setJValue } from "../../(data)/store/stationSlice";
import { runData, scenarioData } from "@/data/allData";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function TopOptions({ station }) {
  const dispatch = useDispatch();
  const { selectedFile, selectedScenario, jValue } = useSelector((state) => state.station);

  const [selectedRun, setSelectedRun] = useState("");
  const [savedFiles, setSavedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true); // حالة التحميل
  const [selectedProject, setSelectedProject] = useState("project 1");

  const isFileDisabled = false;
  const isScenarioDisabled = !selectedFile || selectedFile === "select";
  const isRunsDisabled = isScenarioDisabled || !selectedScenario;

  // 🔹 جلب الملفات المحفوظة من الـ API عند التحميل
useEffect(() => {
  async function fetchFiles() {
    try {
      setLoadingFiles(true); // يبدأ التحميل
      const res = await fetch("/api/saveData");
      const data = await res.json();
      if (data.success) {
        const files = data.files.map(f => f.file);
        setSavedFiles(files);
      }
    } catch (err) {
      console.error("Error fetching saved files:", err);
    } finally {
      setLoadingFiles(false); // انتهى التحميل
    }
  }
  fetchFiles();
}, []);

  // 🔹 جلب بيانات الملف عند تغييره
  useEffect(() => {
    if (!selectedFile || selectedFile === "New Plant") return;

    async function fetchFileData() {
      try {
        const res = await fetch("/api/saveData");
        const data = await res.json();
        if (data.success) {
          const fileData = data.files.find(f => f.file === selectedFile);
          if (fileData) {
            dispatch(setSelectedScenario(fileData.data.scenario));
            dispatch(setJValue(fileData.data.j));
          } else {
            dispatch(setSelectedScenario("select"));
            dispatch(setJValue(1));
          }
        }
      } catch (err) {
        console.error("Error fetching file data:", err);
      }
    }
    fetchFileData();
  }, [selectedFile, dispatch]);

  // 🔹 حفظ البيانات
  async function handleSaveProject() {
    const fileName = selectedProject; // دائمًا الاسم من drop list المشروع
    try {
      const res = await fetch("/api/saveData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: fileName,
          scenario: selectedScenario,
          j: jValue,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Saved to Project");
        setSavedFiles(prev => (!prev.includes(fileName) ? [...prev, fileName] : prev));
        dispatch(setSelectedFile(fileName));
      } else {
        toast.error("Save failed");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("Save failed");
    }
  }

  return (
    <div className="bg-white p-4 relative">
      <Toaster  position="top-center" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-4 sm:gap-6 w-full">
        
        {/* File */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 font-medium">{station} File</span>
          <select
  value={selectedFile}
  onChange={(e) => dispatch(setSelectedFile(e.target.value))}
  className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-green-50"
>
  <option value="select">Select</option>
  <option value="New Plant">New Plant</option>

  {loadingFiles && <option disabled>Loading...</option>} {/* يظهر أثناء التحميل */}

  {!loadingFiles && savedFiles.map(f => (
    <option key={f} value={f}>{f}</option>
  ))}
</select>

        </div>

        {/* Scenario */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 font-medium">Scenario</span>
          <select
            value={selectedScenario}
            onChange={(e) => dispatch(setSelectedScenario(e.target.value))}
            disabled={isScenarioDisabled}
            className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50 w-full sm:w-auto"
          >
            <option value="select">Select</option>
            {scenarioData.map(s => <option key={s} value={s}>{s}</option>)}
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
              {runData.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              disabled={isRunsDisabled}
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Save to Project */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">Save to Project</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-1 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition disabled:opacity-50 w-full sm:w-auto"
            >
              {["project 1", "project 2", "project 3", "project 4", "project 5"].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={handleSaveProject}
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 cursor-pointer text-sm"
            >
              Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
