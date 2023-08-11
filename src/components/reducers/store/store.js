import { configureStore } from "@reduxjs/toolkit";
import locationSlice from "../reducer/locationSlice";
export default configureStore({
  reducer: {
    locationList: locationSlice,
  },
});
