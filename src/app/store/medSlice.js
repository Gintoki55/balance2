import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StationValueData } from "../(stations)/med/(data)/medData";
import { toast } from "react-hot-toast";

// ─── Thunks كما عندك تماماً ─────────────────────────────

// 🧮 تشغيل الحسابات
export const runCalculationNow = createAsyncThunk(
  "med/runCalculationNow",
  async (_, { getState, dispatch }) => {
    const { stationData } = getState().med;
    if (!stationData) return;

    const newData = stationData.map((row) =>
      row.map((cell) => {
        // ✅ استثناء الحقول J و N
        if (cell.key === "Ja") {
          return cell;
        }

        // ✅ استثناء القيم الفارغة أو "-" أو undefined أو غير رقمية
        if (
          cell.value === null ||
          cell.value === undefined ||
          cell.value === "" ||
          cell.value === "-" ||
          isNaN(Number(cell.value))
        ) {
          return cell;
        }

        // ✅ فقط القيم الرقمية يتم تحديثها
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
  "med/fetchSavedFiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/medData");
      const data = await res.json();
      if (data.success) {
        return data.files.map((f) => f.file);
      } else {
        return rejectWithValue("Failed to fetch files");
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveProject = createAsyncThunk(
  "med/saveProject",
  async ({ fileName, selectedScenario, stationData }, { getState, dispatch, rejectWithValue }) => {
    try {
      // 👇 استخدم الاسم الجديد إن وجد، وإلا خذ الاسم الحالي من الـ state
      const { selectedFile } = getState().med;
      const finalFileName = fileName || selectedFile || "New Plant";

      const res = await fetch("/api/medData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: finalFileName,
          scenario: selectedScenario,
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
      return rejectWithValue(err.message);
    }
  }
);

// 📂 تحميل بيانات ملف محدد
export const fetchFileData = createAsyncThunk(
  "med/fetchFileData",
  async (fileName, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch("/api/medData");
      const data = await res.json();

      if (data.success) {
        const fileData = data.files.find((f) => f.file === fileName);
        if (fileData) {
          // ✅ استرجاع كل القيم المحفوظة
          dispatch(setSelectedScenario(fileData.data.scenario));

          // إذا في stationData محفوظ نرجعه كما هو
          if (fileData.data.stationData) {
            dispatch(setStationData(fileData.data.stationData));
          } else {
            // إذا ما في بيانات محفوظة نرجع الافتراضي
            const updatedData = StationValueData.map((row) =>
              row.map((cell) => {
                if (cell.key === "Ja") return { ...cell, value: 1 };
                return cell;
              })
            );
            dispatch(setStationData(updatedData));
          }
        } else {
          // في حال ما وجد الملف، نرجع القيم الافتراضية
          dispatch(setSelectedScenario("Design"));

          const resetData = StationValueData.map((row) =>
            row.map((cell) => {
              if (cell.key === "Ja") return { ...cell, value: 1 };
              return cell;
            })
          );
          dispatch(setStationData(resetData));
        }
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// 📊 جلب جميع Dashboards
export const fetchDashboards = createAsyncThunk(
  "med/fetchDashboards",
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
      return rejectWithValue(err.message);
    }
  }
);

// 💾 حفظ أو تحديث Dashboard
export const saveDashboard = createAsyncThunk(
  "med/saveDashboard",
  async ({ selectedDashboard, stationData }, { rejectWithValue }) => {
    try {
      let dashboardName = selectedDashboard;

      // 🆕 إذا المستخدم اختار "New Dashboard"
      if (selectedDashboard === "New Dashboard") {
        const res = await fetch("/api/dashboard");
        const json = await res.json();

        if (json.success) {
          const existing = json.dashboards.map((d) => d.name);
          let nextNumber = 1;
          while (existing.includes(`D${nextNumber}`)) nextNumber++;
          dashboardName = `D${nextNumber}`;
        }
      }

      // 🔹 إرسال البيانات إلى API
      const saveRes = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dashboardName,
          stationData,
        }),
      });

      const data = await saveRes.json();

      if (data.success) {
        toast.success(`Dashboard saved as ${dashboardName}`);
        return dashboardName;
      } else {
        toast.error("Save failed");
        return rejectWithValue("Save failed");
      }
    } catch (err) {
      toast.error("Error saving dashboard");
      return rejectWithValue(err.message);
    }
  }
);


// ─── الحالة الأساسية والـ reducers ────────────────────────────

const initialState = {
  selectedFile: "",
  selectedScenario: "Design",
  stationData: StationValueData,
  savedFiles: [],
  loadingFiles: false,
  error: null,
  dashboards: [],
  dashboardSaveLoading: false,
  loadingDashboard:true,
};

export const medSlice = createSlice({
  name: "med",
  initialState,
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setSelectedScenario: (state, action) => {
      state.selectedScenario = action.payload;
      if (state.stationData.length > 0 && state.stationData[0].length > 0) {
        state.stationData[0][0].value = action.payload;
      }
    },
    setStationData: (state, action) => {
      state.stationData = action.payload;
    },

    resetStation: (state) => {
      state.selectedFile = "New Plant";
      state.selectedScenario = "Design";
      state.stationData = StationValueData.map((row) =>
        row.map((cell) => {
          if (cell.key === "Ja") return { ...cell, value: 1 };
          return cell;
        })
      );
    },

    updateCellValue: (state, action) => {
      const { cellKey, value } = action.payload;
      state.stationData = state.stationData.map((row) =>
        row.map((cell) => (cell.key === cellKey ? { ...cell, value } : cell))
      );
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


      .addCase(saveDashboard.pending, (state) => {
        state.dashboardSaveLoading = true;
      })
      .addCase(saveDashboard.fulfilled, (state, action) => {
        state.dashboardSaveLoading = false;
        if (!state.dashboards.includes(action.payload)) {
          state.dashboards.push(action.payload);
        }
      })
      .addCase(saveDashboard.rejected, (state) => {
        state.dashboardSaveLoading = false;
      });

  },
});

export const {
  setSelectedFile,
  setSelectedScenario,
  setStationData,
  resetStation,
  updateCellValue,
} = medSlice.actions;

export default medSlice.reducer;