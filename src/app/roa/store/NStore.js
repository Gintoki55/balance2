// store/nStore.js
import { create } from "zustand";

export const useNStore = create((set) => ({
  n: {},

  setN: (stationName, value) =>
    set((state) => ({
      n: { ...state.n, [stationName]: Number(value) },
    })),

  resetN: (stationName) =>
    set((state) => ({
      n: { ...state.n, [stationName]: 1 },
    })),

  // 🔥 عند اختيار محطة جديدة، مباشرة نخليها 1
  initStation: (stationName) =>
    set((state) => ({
      n: { ...state.n, [stationName]: 1 },
    })),
}));
