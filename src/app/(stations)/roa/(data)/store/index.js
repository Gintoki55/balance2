import { configureStore } from "@reduxjs/toolkit";
import stationReducer from "./stationSlice";

export const store = configureStore({
  reducer: {
    station: stationReducer,
  },
});
