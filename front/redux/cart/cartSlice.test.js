import cartReducer, { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart, loadCart } from './cartSlice';

describe('cartSlice', () => {
    const initialState = {
        items: {},
        totalQuantity: 0,
        totalAmount: 0,
    };

    it('should handle initial state', () => {
        expect(cartReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle addToCart', () => {
        const product = { id: 1, name: 'Product 1', price: 10 };
        const state = cartReducer(initialState, addToCart(product));
        expect(state.items[1].quantity).toEqual(1);
        expect(state.totalQuantity).toEqual(1);
        expect(state.totalAmount).toEqual(10);
    });

    it('should handle removeFromCart', () => {
        const initialStateWithItem = {
            items: { 1: { id: 1, name: 'Product 1', price: 10, quantity: 2 } },
            totalQuantity: 2,
            totalAmount: 20,
        };
        const state = cartReducer(initialStateWithItem, removeFromCart(1));
        expect(state.items[1].quantity).toEqual(1);
        expect(state.totalQuantity).toEqual(1);
        expect(state.totalAmount).toEqual(10);
    });

    it('should handle clearCart', () => {
        const initialStateWithItems = {
            items: { 1: { id: 1, name: 'Product 1', price: 10, quantity: 2 } },
            totalQuantity: 2,
            totalAmount: 20,
        };
        const state = cartReducer(initialStateWithItems, clearCart());
        expect(state.items).toEqual({});
        expect(state.totalQuantity).toEqual(0);
        expect(state.totalAmount).toEqual(0);
    });
});