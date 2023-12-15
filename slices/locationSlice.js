import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to get location name
export const fetchLocationName = createAsyncThunk(
  "location/fetchLocationName",
  async ({ lat, long }) => {
    const response = await fetch("/api/getLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, long }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.location;
    } else {
      const error = await response.json();
      throw new Error(error.error);
    }
  }
);

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    latitude: null,
    longitude: null,
    locationName: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocationName.fulfilled, (state, action) => {
      state.locationName = action.payload;
    });
  },
});

export const { setLocation } = locationSlice.actions;
export const selectLocation = (state) => state.location;
export default locationSlice.reducer;
