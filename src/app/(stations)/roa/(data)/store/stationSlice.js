import { createSlice } from "@reduxjs/toolkit";
import { StationValueData } from "../roData";

const initialState = {
  selectedFile: "",
  selectedScenario: "Design",
  jValue: 1,
  stationData:StationValueData,
};

export const stationSlice = createSlice({
  name: "station",
  initialState,
  reducers: {
    setSelectedFile: (state, action) => { state.selectedFile = action.payload },
    setSelectedScenario: (state, action) => { state.selectedScenario = action.payload },
    setJValue: (state, action) => { state.jValue = action.payload },
    setStationData: (state, action) => { state.stationData = action.payload },
    resetStation: () => initialState,
    updateCellValue: (state, action) => {
      const { cellKey, value } = action.payload;
      for (let row of state.stationData) {
        for (let cell of row) {
          if (cell.key === cellKey) {
            cell.value = value;
            return;
          }
        }
      }
    }
  },

});

export const { setSelectedFile, setSelectedScenario, setJValue, resetStation,setStationData, updateCellValue } = stationSlice.actions;
export default stationSlice.reducer;
