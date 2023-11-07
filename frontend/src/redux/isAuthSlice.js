import { createSlice } from "@reduxjs/toolkit"

const isAuthSlice = createSlice({
    name: "isAuth",
    initialState: {
        value: null
    },
    reducers: {
        setIsAuth: (state, action) => {
            state.value = action.payload; 
        }
    }
})

export const { setIsAuth } = isAuthSlice.actions;
export const selectIsAuth = (state) => state.isAuth.value; 
export default isAuthSlice.reducer;