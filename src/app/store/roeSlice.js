import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StationValueData } from "../(stations)/(RO)/roe/(data)/roeData";
import { toast } from "react-hot-toast";

// ─── Thunks كما عندك تماماً ─────────────────────────────

// 🧮 تشغيل الحسابات
export const runCalculationNow = createAsyncThunk(
  "roe/runCalculationNow",
  async (_, { getState, dispatch }) => {
    const { stationData } = getState().roe;
    if (!stationData) return;

    const newData = stationData.map((row) =>
      row.map((cell) => {
        // ✅ استثناء الحقول J و N
        if (
  cell.key === "Ja" ||
  cell.key === "Jb" ||
  cell.key === "Jc" ||
  cell.key === "Na" ||
  cell.key === "Nc"
) {
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
  "roe/fetchSavedFiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/roeData");
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
  "roe/saveProject",
  async ({ fileName, stationData }, { getState, dispatch, rejectWithValue }) => {
    try {
      // 👇 استخدم الاسم الجديد إن وجد، وإلا خذ الاسم الحالي من الـ state
      const { selectedFile } = getState().roe
      const finalFileName = fileName || selectedFile || "New Plant";

      const res = await fetch("/api/roeData", {
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
         if (finalFileName === "New Plant") {
          dispatch(setStationData(stationData));
        }
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
  "roe/fetchFileData",
  async (fileName, { dispatch }) => {
    try {
      const res = await fetch("/api/roeData");
      const data = await res.json();

      // dispatch(setStationData(null));

      if (data.success) {
        const fileData = data.files.find((f) => f.file === fileName);

        if (fileData && fileData.data.stationData) {
          // 👍 موجود في الداتا
          dispatch(setStationData(fileData.data.stationData));
          return;
        }

        // ❗ لا يوجد في الداتا → نستخدم الافتراضي (مره واحدة فقط)
        dispatch(setStationData(StationValueData));
      }
    } catch (err) {
      dispatch(setStationData(StationValueData));
    }
  }
);

// 📊 جلب جميع Dashboards
export const fetchDashboards = createAsyncThunk(
  "roe/fetchDashboards",
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
  "roe/saveDashboard",
  async ({ selectedDashboard, stationData }, { rejectWithValue }) => {
    try {
      const dashboardName = selectedDashboard; // المستخدم اختاره مباشرة (D1 إلى D20)

     
      // 🔍 استخراج قيمة J من stationData
      const jaCell = stationData?.flat()?.find((cell) => cell.key === "Ja");
      const jbCell = stationData?.flat()?.find((cell) => cell.key === "Jb");
      const jcCell = stationData?.flat()?.find((cell) => cell.key === "Jc");
    

      const jaValue = Array.isArray(jaCell?.value) ? jaCell.value[0] : jaCell?.value ?? 2;
      const jbValue = Array.isArray(jbCell?.value) ? jbCell.value[0] : jbCell?.value ?? 2;
      const jcValue = Array.isArray(jcCell?.value) ? jcCell.value[0] : jcCell?.value ?? 2;

      const JValues = [jaValue,jbValue, jcValue]

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
  stationData: null,
  savedFiles: [],
  loadingFiles: false,
  error: null,
  dashboards: [],
  loadingDashboard:true,
  hasUnsavedChanges: false,
  activeIndex: 0,
  editAll: false,
};

export const roeSlice = createSlice({
  name: "roe",
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
    setEditAll: (state, action) => {
      state.editAll = action.payload; // true or false
    },

    resetStation: (state) => {
      state.selectedFile = "New Plant";
      state.stationData = StationValueData.map((row) =>
        row.map((cell) => {
          if (cell.key === "Ja") return { ...cell, value: [2] };
          if (cell.key === "Jb") return { ...cell, value: [2] };
          if (cell.key === "Jc") return { ...cell, value: [2] };
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
      if (cell.key !== cellKey) return { ...cell };

      // Array
      if (Array.isArray(cell.value)) {
        const newValues = [...cell.value];
        newValues[index] = value;

        return {
          ...cell,
          value: newValues,
        };
      }

      // Single value
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
                   const fileName = action.payload;
                   if (fileName !== "New Plant" && !state.savedFiles.includes(fileName)) {
                     state.savedFiles.push(fileName);
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
  setEditAll,
  setHasUnsavedChanges
} = roeSlice.actions;

export default roeSlice.reducer;