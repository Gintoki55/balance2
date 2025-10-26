import { configureStore } from "@reduxjs/toolkit";
import stationReducer from "./stationSlice";
import msfReducer from "./msfSlice";
import medReducer from "./medSlice";

export const store = configureStore({
  reducer: {
    station: stationReducer,
    msf: msfReducer,
    med: medReducer,
  },
});
