// store/jaStore.js
import { create } from "zustand";

export const useJaStore = create((set) => ({
  ja: {},

  setJa: (stationName, value) =>
    set((state) => ({
      ja: { ...state.ja, [stationName]: Number(value) },
    })),

  resetJa: (stationName) =>
    set((state) => ({
      ja: { ...state.ja, [stationName]: 1 },
    })),

  // 🔥 عند اختيار محطة جديدة، مباشرة نخليها 1
  initStation: (stationName) =>
    set((state) => ({
      ja: { ...state.ja, [stationName]: 1 },
    })),
}));
