import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./features/auth/userReducer";
import cartSlice from './cart/cartSlice'

export default configureStore({
    reducer: {
        user: userReducer,
        cart: cartSlice
    },
});

// HOST pour se connecter au back-end attention cette adresse IP peut changer.
export const server = "http://192.168.11.100:8080/api/v1"
// "https://combative-cod-life-jacket.cyclic.app/api/v1";
// 192.168.11.100:8080/api/v1
