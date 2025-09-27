// store/jStore.js
import { create } from "zustand";

export const useJStore = create((set) => ({
  j: {},

  setJ: (stationName, value) =>
    set((state) => ({
      j: { ...state.j, [stationName]: Number(value) },
    })),

  resetJ: (stationName) =>
    set((state) => ({
      j: { ...state.j, [stationName]: 1 },
    })),

  // 🔥 عند اختيار محطة جديدة، مباشرة نخليها 1
  initStation: (stationName) =>
    set((state) => ({
      j: { ...state.j, [stationName]: 1 },
    })),
}));
