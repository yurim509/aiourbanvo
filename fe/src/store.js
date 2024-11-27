import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slice/loginSlice"

export const store = configureStore({
    reducer: {
        "loginSlice": loginSlice
    }
});