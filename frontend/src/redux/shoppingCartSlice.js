import { createSlice } from "@reduxjs/toolkit";

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState: {
    value: [],
  },
  reducers: {
    updateShoppingCart: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateShoppingCart } = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
