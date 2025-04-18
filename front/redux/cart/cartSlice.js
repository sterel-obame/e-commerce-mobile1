import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

// Action pour charger le panier depuis SecureStore
export const loadCart = createAsyncThunk('cart/loadCart', async () => {
    try {
        const cartData = await SecureStore.getItem('cart');
        return cartData ? JSON.parse(cartData) : { items: [], totalQuantity: 0, totalAmount: 0 };
    } catch (error) {
        console.error('Failed to load cart from SecureStore:', error);
        return { items: [], totalQuantity: 0, totalAmount: 0 };
    }
});

// Sauvegarde du panier dans AsyncStorage
const saveCartToStorage = async (cart) => {
    try {
        await SecureStore.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Failed to save cart to SecureStore:', error);
    }
};

// Initialisation vide en attendant le chargement du panier
const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        // fonction qui ajoute le produit dans le panier
        addToCart(state, action) {
            const product = action.payload;
            const existingItem = state.items.find(item => item._id === product._id);

            if (existingItem) {
                existingItem.quantity += product.quantity || 1;
            } else {
                state.items.push({ ...product, quantity: product.quantity || 1 });
            }

            state.totalQuantity += product.quantity || 1;
            state.totalAmount += product.price * (product.quantity || 1);
            saveCartToStorage(state);
        },

        // 
        removeFromCart(state, action) {
            const productId = action.payload;
        
            const existingItem = state.items.find(item => item._id === productId);
        
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.price * existingItem.quantity;
                state.items = state.items.filter(item => item._id !== productId);
                saveCartToStorage(state);
            } else {
            }
        },

        // la fonction qui permet d'incrémenter la quantité du produit dans le panier
        incrementQuantity: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => item._id === productId);

            if (item) {
                item.quantity++;
                state.totalQuantity++;
                state.totalAmount += item.price;
                saveCartToStorage(state);
            }
        },

        // la fonction qui permet de décrémenter la quantité du produit dans le panier
        decrementQuantity: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => item._id === productId);

            if (item) {
                if (item.quantity > 1) {
                    item.quantity--;
                    state.totalQuantity--;
                    state.totalAmount -= item.price;
                } else {
                    state.items = state.items.filter(i => i._id !== productId);
                    state.totalQuantity--;
                    state.totalAmount -= item.price;
                }
                saveCartToStorage(state);
            }
        },

        // la fonction qui permet de vider tout le panier
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            saveCartToStorage(state);
        },
    },

    extraReducers: (builder) => {
        builder.addCase(loadCart.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { addToCart, incrementQuantity, decrementQuantity, clearCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
