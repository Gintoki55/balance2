import { create } from "zustand";

export const useJStore = create((set, get) => ({
  data: {},

  // تحديث j لقيمة معينة
  setJ: (file, scenario, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [file]: {
          ...(state.data[file] || {}),
          [scenario]: {
            ...(state.data[file]?.[scenario] || {}),
            j: Number(value),
          },
        },
      },
    })),

  // تحديث آخر سيناريو لكل ملف
  setLastScenario: (file, scenario) =>
    set((state) => ({
      data: {
        ...state.data,
        [file]: {
          ...(state.data[file] || {}),
          lastScenario: scenario,
        },
      },
    })),

  // getters: قيم مباشرة بدل دوال
  getJ: (file, scenario) => get().data[file]?.[scenario]?.j ?? 1,

  getLastScenario: (file) => get().data[file]?.lastScenario ?? "select",
}));
