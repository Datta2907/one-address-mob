import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { isTokenExpired } from '../utils/checkTokenExpiry';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        tokenExpired: false
    },
    reducers: {
        checkTokenValid: async (state, action) => {
            const token = await AsyncStorage.getItem("authToken");
            if (isTokenExpired(token)) {
                state.tokenExpired = true;
            }
        },
        setToken: async (state, action) => {
            await AsyncStorage.setItem("authToken", action.payload.token);
            state.tokenExpired = false;
        }
    }
});

export const { checkTokenValid, setToken } = authSlice.actions;
export default authSlice.reducer;