// import {createSlice,configureStore} from "@reduxjs/toolkit";

// const initialState = {
//     user:"",isLoggedIn:false
// }

// const authSlice=createSlice({
//     name:"auth",
//     initialState,
//     reducers:{
//         login(state){
//             state.isLoggedIn=true;
//         },
//         logout(state){
//             state.isLoggedIn=false;
//         },
//     },
// });
// const coinSlice = createSlice({
//     name: "coin",
//     initialState: { balance: 0 },
//     reducers: {
//       setBalance(state, action) {
//         state.balance = action.payload;
//       },
//     },
//   });
//   // Exporting actions
// export const authActions=authSlice.actions;
// export const coinActions = coinSlice.actions;

// export const store =configureStore({
//     reducer: {
//         auth: authSlice.reducer,
//         coin: coinSlice.reducer,
//       },
// });

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Uses localStorage for persistence
import { persistReducer, persistStore } from "redux-persist";
import { authSlice, coinSlice } from "./Slice";
// Config for persisting the coin state
const coinPersistConfig = {
  key: "coin",
  storage, // Saves state in localStorage
};
// Root reducer with persist configuration
const rootReducer = combineReducers({
  auth: authSlice.reducer, // Auth state (not persisted)
  coin: persistReducer(coinPersistConfig, coinSlice.reducer), // Persisted coin state
});
// Configure store
export const store = configureStore({
  reducer: rootReducer,
});
// Persistor for persisting store
export const persistor = persistStore(store);
