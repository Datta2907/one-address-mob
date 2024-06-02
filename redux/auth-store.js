import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        tokenExpired: false
    },
    reducers: {
        checkTokenValid: (state, action) => {
            const token = action.payload.token;
            if (token) {
                state.tokenExpired = false;
            } else {
                state.tokenExpired = true;
            }
        }
    }
});

export const { checkTokenValid } = authSlice.actions;
export default authSlice.reducer;