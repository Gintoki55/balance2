// store/jbStore.js
import { create } from "zustand";

export const useJbStore = create((set) => ({
  jb: {},

  setJb: (stationName, value) =>
    set((state) => ({
      jb: { ...state.jb, [stationName]: Number(value) },
    })),

  resetJb: (stationName) =>
    set((state) => ({
      jb: { ...state.jb, [stationName]: 1 },
    })),

  // 🔥 عند اختيار محطة جديدة، مباشرة نخليها 1
  initStation: (stationName) =>
    set((state) => ({
      jb: { ...state.jb, [stationName]: 1 },
    })),
}));
