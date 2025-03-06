import { createSlice } from "@reduxjs/toolkit";
// 🔹 Initial State for Auth
const authInitialState = {
  user: "",
  isLoggedIn: false,
};
// 🔹 Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});
// 🔹 Coin Slice
const coinSlice = createSlice({
  name: "coin",
  initialState: {balance : 0},
  reducers: {
    setBalance(state, action) {
      state.balance = action.payload;
    },
  },
});
// 🔹 Export Slices & Actions
export const authActions = authSlice.actions;
export const coinActions = coinSlice.actions;
export { authSlice, coinSlice };
