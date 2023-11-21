import { createSlice } from "@reduxjs/toolkit";

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState: {
    value: [],
  },
  reducers: {
    setShoppingCart: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default shoppingCartSlice.reducer;
