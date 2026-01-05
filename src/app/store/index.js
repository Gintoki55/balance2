import { configureStore } from "@reduxjs/toolkit";
import roaReducer from "./roaSlice";
import robReducer from "./robSlice";
import msfReducer from "./msfSlice";
import medReducer from "./medSlice";
import rocReducer from "./rocSlice"
import rodReducer from "./rodSlice"
import roeReducer from "./roeSlice"
import rofReducer from "./rofSlice"
import rogReducer from "./rogSlice"

export const store = configureStore({
  reducer: {
    roa: roaReducer,
    rob: robReducer,
    roc: rocReducer,
    rod: rodReducer,
    roe: roeReducer,
    rof: rofReducer,
    rog: rogReducer,
    msf: msfReducer,
    med: medReducer,
  },
});
