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
      return console.log(err.message);
    }
  }
);

export const saveProject = createAsyncThunk(
  "med/saveProject",
  async ({ fileName, stationData }, { getState, dispatch, rejectWithValue }) => {
    try {
      // 👇 استخدم الاسم الجديد إن وجد، وإلا خذ الاسم الحالي من الـ state
      const { selectedFile } = getState().med;
      const finalFileName = fileName || selectedFile || "New Plant";

      const res = await fetch("/api/medData", {
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
  "med/fetchFileData",
  async (fileName, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch("/api/medData");
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
                if (cell.key === "Ja") return { ...cell, value: 1 };
                return cell;
              })
            );
            dispatch(setStationData(updatedData));
          }
        } else {
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
      return console.log(err.message);
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
      return console.log(err.message);
    }
  }
);

export const saveDashboard = createAsyncThunk(
  "med/saveDashboard",
  async ({ selectedDashboard, stationData }, { rejectWithValue }) => {
    try {
      const dashboardName = selectedDashboard; // المستخدم اختاره مباشرة (D1 إلى D20)
   // 🔹 ابحث عن الخلايا الخاصة بـ Jb و Jc
      const jaCell = stationData.flat().find((cell) => cell.key === "Ja");

      // 🔹 تأكد أن القيم موجودة، وإذا لا موجودة عيّنها كـ null لتفادي الأخطاء
      const JValues = [
        jaCell ? jaCell.value : null,
      ];

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
};

export const medSlice = createSlice({
  name: "med",
  initialState,
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setStationData: (state, action) => {
      state.stationData = action.payload;
    },
    resetStation: (state) => {
      state.selectedFile = "New Plant";
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

  },
});

export const {
  setSelectedFile,
  setStationData,
  resetStation,
  updateCellValue,
} = medSlice.actions;

export default medSlice.reducer;