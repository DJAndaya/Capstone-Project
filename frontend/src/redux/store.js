import { configureStore } from "@reduxjs/toolkit"
import isAuthSlice from "./isAuthSlice"
import shoppingCartSlice from "./shoppingCartSlice"

const store = configureStore({
    reducer: {
        isAuth: isAuthSlice,
        shoppingCart: shoppingCartSlice
    }
})

export default store

window.store = store // store.getState()