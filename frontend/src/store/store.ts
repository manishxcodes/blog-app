import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialAuthState = {
    user: sessionStorage.getItem("user") || "",
    isLoggedIn: !!sessionStorage.getItem("token"),
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.user = action.payload;
            sessionStorage.setItem("token", action.payload);
        },
        logout(state) {
            state.isLoggedIn = false,
            state.user = "";
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        }
    }
});

export const authActions = authSlice.actions;

export const store = configureStore({
    reducer: authSlice.reducer
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;