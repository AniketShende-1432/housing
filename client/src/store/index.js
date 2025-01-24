import {createSlice,configureStore} from "@reduxjs/toolkit";

const initialState = {
    auth:{user:"",isLoggedIn:false},
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login(state){
            state.auth.isLoggedIn=true;
        },
        logout(state){
            state.auth.isLoggedIn=false;
        },
    },
});

export const authActions=authSlice.actions;

export const store =configureStore({
    reducer:authSlice.reducer,
});