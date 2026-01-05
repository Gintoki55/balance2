import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StationValueData } from "../(stations)/(RO)/rof/(data)/rofData";
import { toast } from "react-hot-toast";

// ─── Thunks كما عندك تماماً ─────────────────────────────

// 🧮 تشغيل الحسابات
// 🧮 تشغيل الحسابات
export const runCalculationNow = createAsyncThunk(
  "rof/runCalculationNow",
  async (_, { getState, dispatch }) => {
    const { stationData } = getState().rof;
    if (!stationData) return;

    const newData = stationData.map((row) =>
      row.map((cell) => {
        // ✅ استثناء الحقول J و N
        if (cell.key === "Ja" || cell.key === "Jb" || cell.key === "Jc" ||  cell.key === "Jd" || cell.key === "Na" | cell.key === "Nc") {
          return cell;
        }

        // 🔹 لو القيمة مصفوفة
        if (Array.isArray(cell.value)) {
          const newValues = cell.value.map((v) => {
            if (
              v === null ||
              v === undefined ||
              v === "" ||
              v === "-" ||
              isNaN(Number(v))
            ) {
              return v;
            }
            return Number(v) * 2;
          });

          return {
            ...cell,
            value: newValues,
          };
        }

        // 🔹 لو القيمة مفردة
        if (
          cell.value === null ||
          cell.value === undefined ||
          cell.value === "" ||
          cell.value === "-" ||
          isNaN(Number(cell.value))
        ) {
          return cell;
        }

        return {
          ...cell,
          value: Number(cell.value) * 2,
        };
      })
    );

    dispatch(setStationData(newData));
    toast.success("Calculation updated!");
  }
);


// 📁 جلب الملفات المحفوظة
export const fetchSavedFiles = createAsyncThunk(
  "rof/fetchSavedFiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/rofData");
      const data = await res.json();
      if (data.success) {
        return data.files.map((f) => f.file);
      } else {
        return rejectWithValue("Failed to fetch files");
      }
    } catch (err) {
      return console.log(err.message);
    }
  }
);

// 💾 حفظ المشروع
export const saveProject = createAsyncThunk(
  "rof/saveProject",
  async ({ fileName, stationData }, { getState, dispatch, rejectWithValue }) => {
    try {
      // 👇 استخدم الاسم الجديد إن وجد، وإلا خذ الاسم الحالي من الـ state
      const { selectedFile } = getState().rof
      const finalFileName = fileName || selectedFile || "New Plant";

      const res = await fetch("/api/rofData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: finalFileName,
          stationData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(setSelectedFile(finalFileName)); // ✅ نحدّث الاسم بعد الحفظ
        toast.success(`Saved successfully as ${finalFileName}`);
        return finalFileName;
      } else {
        toast.error("Save failed");
        return rejectWithValue("Save failed");
      }
    } catch (err) {
      toast.error("Save failed");
      return console.log(err.message);
    }
  }
);


// 📂 تحميل بيانات ملف محدد
export const fetchFileData = createAsyncThunk(
  "rof/fetchFileData",
  async (fileName, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch("/api/rofData");
      const data = await res.json();

      if (data.success) {
        const fileData = data.files.find((f) => f.file === fileName);
        if (fileData) {

          // إذا في stationData محفوظ نرجعه كما هو
          if (fileData.data.stationData) {
            dispatch(setStationData(fileData.data.stationData));
          } else {
            // إذا ما في بيانات محفوظة نرجع الافتراضي
            const updatedData = StationValueData.map((row) =>
              row.map((cell) => {
                if (cell.key === "Na") return { ...cell, value: 1 };
                if (cell.key === "Nc") return { ...cell, value: 1 };
                if (cell.key === "Ja") return { ...cell, value: 2 };
                if (cell.key === "Jb") return { ...cell, value: 2 };
                if (cell.key === "Jc") return { ...cell, value: 2 };
                if (cell.key === "Jd") return { ...cell, value: 2 };
                return cell;
              })
            );
            dispatch(setStationData(updatedData));
          }
        } else {

          const resetData = StationValueData.map((row) =>
            row.map((cell) => {
               if (cell.key === "Na") return { ...cell, value: 1 };
               if (cell.key === "Nc") return { ...cell, value: 1 };
               if (cell.key === "Ja") return { ...cell, value: 2 };
               if (cell.key === "Jb") return { ...cell, value: 2 };
               if (cell.key === "Jc") return { ...cell, value: 2 };
               if (cell.key === "Jd") return { ...cell, value: 2 };
              return cell;
            })
          );
          dispatch(setStationData(resetData));
        }
      }
    } catch (err) {
      return console.log(err.message);
    }
  }
);

// 📊 جلب جميع Dashboards
export const fetchDashboards = createAsyncThunk(
  "rof/fetchDashboards",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.success) {
        return data.dashboards.map((d) => d.name);
      } else {
        return rejectWithValue("Failed to fetch dashboards");
      }
    } catch (err) {
      return console.log(err.message);
    }
  }
);

export const saveDashboard = createAsyncThunk(
  "rof/saveDashboard",
  async ({ selectedDashboard, stationData }, { rejectWithValue }) => {
    try {
      const dashboardName = selectedDashboard; // المستخدم اختاره مباشرة (D1 إلى D20)

     
      // 🔍 استخراج قيمة J من stationData
      const jaCell = stationData.flat().find((cell) => cell.key === "Ja");
      const jbCell = stationData.flat().find((cell) => cell.key === "Jb");
      const jcCell = stationData.flat().find((cell) => cell.key === "Jc");
      const jdCell = stationData.flat().find((cell) => cell.key === "Jd");

      const jaValue = jaCell ? jaCell.value : 2;
      const jbValue = jbCell ? jbCell.value : 2;
      const jcValue = jcCell ? jcCell.value : 2;
      const jdValue = jdCell ? jdCell.value : 2;

      const JValues = [jaValue,jbValue,jcValue, jdValue]

      // 🔹 إرسال البيانات إلى الـ API
      const saveRes = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dashboardName,
          stationData,
          JValues,
        }),
      });
      const data = await saveRes.json();

      if (data.success) {
        toast.success(`Saved to ${dashboardName}`);
        return dashboardName;
      } else {
        toast.error(" Save failed");
        return rejectWithValue("Save failed");
      }
    } catch (err) {
      toast.error("Error saving dashboard");
      return console.log(err.message);
    }
  }
);


// ─── الحالة الأساسية والـ reducers ────────────────────────────

const initialState = {
  selectedFile: "",
  stationData: StationValueData,
  savedFiles: [],
  loadingFiles: false,
  error: null,
  dashboards: [],
  loadingDashboard:true,
  hasUnsavedChanges: false,
  activeIndex: 0,
};

export const rofSlice = createSlice({
  name: "rof",
  initialState,
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setStationData: (state, action) => {
      state.stationData = action.payload;
    },
    //activte index
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },

    resetStation: (state) => {
      state.selectedFile = "New Plant";
      state.stationData = StationValueData.map((row) =>
        row.map((cell) => {
          if (cell.key === "Ja") return { ...cell, value: [2] };
          if (cell.key === "Jb") return { ...cell, value: [2] };
          if (cell.key === "Jc") return { ...cell, value: [2] };
          if (cell.key === "Jd") return { ...cell, value: [2] };
          if (cell.key === "Na") return { ...cell, value: [1] };
          if (cell.key === "Nc") return { ...cell, value: [1] };
          return cell;
        })
      );
      state.hasUnsavedChanges = false;
    },

    updateCellValue: (state, action) => {
      const { cellKey, value, index } = action.payload;

      state.stationData = state.stationData.map((row) =>
        row.map((cell) => {
          if (cell.key !== cellKey) return cell;

          // 🔹 لو value Array
          if (Array.isArray(cell.value)) {
            const newValues = [...cell.value];
            newValues[index] = value;

            return {
              ...cell,
              value: newValues,
            };
          }

          // 🔹 لو value عادي
          return {
            ...cell,
            value,
          };
        })
      );

      state.hasUnsavedChanges = true;
    },


    setHasUnsavedChanges: (state, action) => {
      state.hasUnsavedChanges = action.payload; // ← للتحكم بها يدوياً
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedFiles.pending, (state) => {
        state.loadingFiles = true;
      })
      .addCase(fetchSavedFiles.fulfilled, (state, action) => {
        state.loadingFiles = false;
        state.savedFiles = action.payload;
      })
      .addCase(fetchSavedFiles.rejected, (state, action) => {
        state.loadingFiles = false;
        state.error = action.payload;
      })


      .addCase(saveProject.fulfilled, (state, action) => {
        if (!state.savedFiles.includes(action.payload)) {
          state.savedFiles.push(action.payload);
        }    
      })


      .addCase(fetchDashboards.pending, (state) => {
        state.loadingDashboard = true;
      })
      .addCase(fetchDashboards.fulfilled, (state, action) => {
        state.loadingDashboard = false;
        state.dashboards = action.payload;
      })
      .addCase(fetchDashboards.rejected, (state) => {
        state.loadingDashboard = false;
      })


  },
});

export const {
  setSelectedFile,
  setStationData,
  resetStation,
  updateCellValue,
  setActiveIndex,
  setHasUnsavedChanges
} = rofSlice.actions;

export default rofSlice.reducer;