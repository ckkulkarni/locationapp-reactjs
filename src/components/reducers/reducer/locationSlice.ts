import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  currentLocation: {
    address: string;
    latitude: number;
    longitude: number;
    dateTime: string;
  };
  previousLocations: any[];
}

const initialState: LocationState = {
  currentLocation: {
    address: "",
    latitude: 0,
    longitude: 0,
    dateTime: "",
  },
  previousLocations: [],
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCurrentLocation: (
      state,
      action: PayloadAction<{
        address: string;
        latitude: number;
        longitude: number;
        dateTime: string;
      }>
    ) => {
      const { address, latitude, longitude, dateTime } = action.payload;
      state.currentLocation = { address, latitude, longitude, dateTime };
    },
    addPreviousLocation: (
      state,
      action: PayloadAction<{
        address: string;
        latitude: number;
        longitude: number;
        dateTime: string;
      }>
    ) => {
      const location = action.payload;
      state.previousLocations.push(location);
    },
    clearPreviousLocations: (state) => {
      state.previousLocations = [];
    },
    removePreviousLocation: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.previousLocations.splice(index, 1);
    },
  },
});

export const {
  setCurrentLocation,
  addPreviousLocation,
  clearPreviousLocations,
  removePreviousLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
