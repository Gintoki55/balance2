import { create } from "zustand";

export const useJaStore = create((set, get) => ({
  data: {},

  // تحديث ja لقيمة معينة
  setJa: (file, scenario, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [file]: {
          ...(state.data[file] || {}),
          [scenario]: {
            ...(state.data[file]?.[scenario] || {}),
            ja: Number(value),
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
  getJa: (file, scenario) => get().data[file]?.[scenario]?.ja ?? 1,

  getLastScenario: (file) => get().data[file]?.lastScenario ?? "select",
}));
