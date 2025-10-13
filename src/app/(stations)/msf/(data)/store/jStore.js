import { create } from "zustand";

export const useStationStore = create((set, get) => ({
  data: {},

  // ✅ set Jb
  setJb: (file, scenario, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [file]: {
          ...(state.data[file] || {}),
          [scenario]: {
            ...(state.data[file]?.[scenario] || {}),
            jb: Number(value),
          },
        },
      },
    })),

  // ✅ set Jc
  setJc: (file, scenario, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [file]: {
          ...(state.data[file] || {}),
          [scenario]: {
            ...(state.data[file]?.[scenario] || {}),
            jc: Number(value),
          },
        },
      },
    })),

  // ✅ set lastScenario
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

  // ✅ getters
  getJb: (file, scenario) => get().data[file]?.[scenario]?.jb ?? 2,
  getJc: (file, scenario) => get().data[file]?.[scenario]?.jc ?? 2,
  getLastScenario: (file) => get().data[file]?.lastScenario ?? "select",
}));
