"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedFile,
  resetStation,
  fetchSavedFiles,
  fetchFileData,
  runCalculationNow,
  saveProject,
  fetchDashboards,
  saveDashboard,
  setHasUnsavedChanges
} from "../../../../../store/rocSlice";
import { runData, projectObject } from "@/data/allData";
import { Play, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAnimate } from "../../(data)/animationContext";
export default function TopOptions({ station }) {
  const dispatch = useDispatch();
  const {
    selectedFile,
    savedFiles,
    loadingFiles,
    stationData,
    isRunning,
    hasUnsavedChanges,
    loadingDashboard,
    dashboards
  } = useSelector((state) => state.roc);
 const [selectedRun, setSelectedRun] = useState("");
  const [selectedProject, setSelectedProject] = useState("select");
  const [selectedDashboard, setSelectedDashboard] = useState("select");

  const [selectedExport, setSelectedExport] = useState("select");
  const [selectedAdmin, setSelectedAdmin] = useState("select");

  const { triggerAnimation } = useAnimate();


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
          selectedFile !== "select" &&
          !hasUnsavedChanges 
        ) {
          dispatch(fetchFileData(selectedFile));
        }
      }, [selectedFile, dispatch, hasUnsavedChanges])

const sortedFiles = [...savedFiles].sort((a, b) => {
  // ترتيب Project 1 → Project 5 أولاً
  const projectOrder = ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5"];

  const indexA = projectOrder.indexOf(a);
  const indexB = projectOrder.indexOf(b);

  if (indexA !== -1 && indexB !== -1) return indexA - indexB; // كلاهما في المشروع
  if (indexA !== -1) return -1; // a في Project list وb لا → a أول
  if (indexB !== -1) return 1;  // b في Project list وa لا → b بعد
  return a.localeCompare(b); // غير ذلك → ترتيب أبجدي
});


  return (
    <div className="bg-white p-4 relative flex flex-col gap-2">
      <Toaster position="top-center" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-4 sm:gap-6 w-full overflow-x-auto">
        {/* File */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 font-medium">{station} Files</span>
          <select
            value={selectedFile}
            onChange={(e) => {
                          const val = e.target.value;
                          // ⛔ إذا هناك تعديلات غير محفوظة → اسأل المستخدم
                          if (hasUnsavedChanges) {
                            const confirmLeave = window.confirm(
                              "لديك تعديلات غير محفوظة، هل تريد تجاهلها والمتابعة؟"
                            );
                            if (!confirmLeave) {
                              return; // ❌ المستخدم رفض — لا تغيّر الملف
                            }
                          }
                           // ✅ إذا اختار New Plant
                          if (val === "New Plant") {
                            dispatch(resetStation());
                            dispatch(setSelectedFile("New Plant"));
                          }
                            // ✅ أي ملف آخر
                          else {
                            dispatch(setSelectedFile(val));
                            dispatch(setHasUnsavedChanges(false));
                          }
                        }}
            className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-green-50"
          >
            <option value="select">open</option>
            <option value="New Plant">New Plant</option>
            {loadingFiles && <option disabled>Loading...</option>}
            {!loadingFiles &&
              sortedFiles.map((f) => (
                <option key={f} value={f}>
                  {f}
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
              className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-blue-50 transition disabled:opacity-50 w-full sm:w-auto"
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
                isRunning ? "bg-gray-400" : "bg-green-600 hover:bg-green-700 "
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


            {/* Save files */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
            Save to Files
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedProject}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedProject(value);

                // ✅ إذا المستخدم اختار مشروع فعلي (وليس "select")
                if (value !== "select" && !value.startsWith("plant")) {
                  dispatch(
                    saveProject({
                      fileName: value,
                      stationData,
                    })
                  );
                  dispatch(setHasUnsavedChanges(false));
                }
              }}
              className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-blue-50 transition w-full sm:w-auto"
            >
              <option value="select">Select</option>

              {/* ✅ عرض المشاريع project 1 → project 5 */}
              {projectObject
                .filter((p) => p.startsWith("project"))
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}

              {/* ✅ فصل مرئي بين القسمين */}
              <option disabled>────────</option>

              {/* ✅ عرض النباتات plant 1 → plant 20 بلون باهت */}
              {projectObject
                .filter((p) => p.startsWith("plant"))
                .map((p) => (
                  <option key={p} value={p} disabled className="text-gray-400">
                    {p} (admin)
                  </option>
                ))}
            </select>
          </div>
        </div>

      {/* ✅ Dashboard Section */}
      <div className="flex flex-col w-full sm:w-auto">
        <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
          Save to
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDashboard}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDashboard(val);

              if (val !== "select") {
                // ✅ حفظ تلقائي عند الاختيار
                dispatch(saveDashboard({ selectedDashboard: val, stationData }));
              }
            }}
            className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-green-50 transition w-full sm:w-auto"
          >
            <option value="select">Dashboard</option>

            {/* ✅ نولّد تلقائيًا D1 إلى D20 */}
            {Array.from({ length: 20 }, (_, i) => (
              <option key={i + 1} value={`D${i + 1}`}>
                D{i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Export To Section */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
            Export To
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedExport}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedExport(val);

                // ✅ تنفيذ الأكشن مباشرة بعد التغيير
                if (val !== "select") {
                  console.log(`Exporting data as: ${val}`);
                  // هنا لاحقاً تقدر تضيف دالة فعلية للتصدير حسب نوع export
                }
              }}
              className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-orange-50 transition w-full sm:w-auto"
            >
              <option value="select">Device</option>
              <option value="excel">As Excel</option>
              <option value="pdf">As PDF</option>
            </select>
          </div>
        </div>

      {/* ✅ Admin Section */}
        <div className="flex flex-col w-full sm:w-auto">
          <span className="text-gray-700 mb-1 text-sm sm:text-base font-medium">
            Admin
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedAdmin}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedAdmin(val);

                // ✅ تنفيذ الأكشن مباشرة بعد التغيير
                if (val !== "select") {
                  console.log(`Admin action: ${val}`);
                  // لاحقاً هنا تقدر تضيف التنقل أو المنطق الخاص بالـ admin section
                }
              }}
              className="px-3 py-1 border border-green-600 rounded-lg text-green-600 hover:bg-red-50 transition w-full sm:w-auto"
            >
              <option value="select">select</option>
              <option value="control">Control</option>
              <option value="subscription">Subscription</option>
              <option value="users">Users</option>
              <option value="experts">Experts</option>
              <option value="institutions">Institutions</option>
            </select>
          </div>
        </div>

      </div>


    </div>
  );
}


  