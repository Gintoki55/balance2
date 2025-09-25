// store/useTopOptionsStore.js
import { create } from "zustand";

export const useTopOptionsStore = create((set) => ({
  selectedFile: "",
  selectedScenario: "",
  selectedRun: "",

  setFile: (file) =>
    set((state) => ({
      selectedFile: file,
      selectedScenario: "", // إعادة تعيين السيناريو عند تغيير الملف
      selectedRun: "",      // إعادة تعيين الجولة
    })),

  setScenario: (scenario) => set({ selectedScenario: scenario }),
  setRun: (run) => set({ selectedRun: run }),

  resetAll: () => set({ selectedFile: "", selectedScenario: "", selectedRun: "" }),
}));
