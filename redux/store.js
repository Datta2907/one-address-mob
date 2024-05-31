import { configureStore } from "@reduxjs/toolkit";

import authReducer from './auth-store';

export const store = configureStore({
    reducer: {
        userDetails: authReducer
    }
})