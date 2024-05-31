import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { isTokenExpired } from '../utils/checkTokenExpiry';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        tokenExpired: false
    },
    reducers: {
        checkTokenValid: (state, action) => {
            const token = action.payload.token;
            if (token) {
                if (isTokenExpired(token)) {
                    state.tokenExpired = true;
                } else {
                    state.tokenExpired = false;
                }
            } else {
                state.tokenExpired = true;
            }
        },
        setToken: (state, action) => {
            state.tokenExpired = false;
        }
    }
});

export const { checkTokenValid, setToken } = authSlice.actions;
export default authSlice.reducer;