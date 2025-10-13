import { createSlice } from "@reduxjs/toolkit";
import { StationValueData } from "../roData";

const initialState = {
  selectedFile: "",
  selectedScenario: "",
  jValue: 1,
  stationData: JSON.parse(JSON.stringify(StationValueData)),
};

export const stationSlice = createSlice({
  name: "station",
  initialState,
  reducers: {
    setSelectedFile: (state, action) => { state.selectedFile = action.payload },
    setSelectedScenario: (state, action) => { state.selectedScenario = action.payload },
    setJValue: (state, action) => { state.jValue = action.payload },
    setStationData: (state, action) => { state.stationData = action.payload },
  },
});

export const { setSelectedFile, setSelectedScenario, setJValue, setStationData } = stationSlice.actions;
export default stationSlice.reducer;
