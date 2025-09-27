// store/jcStore.js
import { create } from "zustand";

export const useJcStore = create((set) => ({
  jc: {},

  setJc: (stationName, value) =>
    set((state) => ({
      jc: { ...state.jc, [stationName]: Number(value) },
    })),

  resetJc: (stationName) =>
    set((state) => ({
      jc: { ...state.jc, [stationName]: 1 },
    })),

  // 🔥 عند اختيار محطة جديدة، مباشرة نخليها 1
  initStation: (stationName) =>
    set((state) => ({
      jc: { ...state.jc, [stationName]: 1 },
    })),
}));
