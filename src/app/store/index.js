import { configureStore } from "@reduxjs/toolkit";
import roaReducer from "./roaSlice";
import msfReducer from "./msfSlice";
import medReducer from "./medSlice";

export const store = configureStore({
  reducer: {
    roa: roaReducer,
    msf: msfReducer,
    med: medReducer,
  },
});
