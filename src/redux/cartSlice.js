import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: { cart: [ ]},
    reducers: {
        addToCart : (state, {payload}) => {
            //* Payload olarak gelen ürün sepette var mı?
            const foundItem = state.cart.find(
                (item) => item.id === payload.item.id && item.type === payload.selectedType
            );
            if(foundItem) {
                //* Sepette eleman varsa miktarını arttır
                foundItem.amount++;

            }else {
                //* Sepette eleman yoksa sepete ekle
                state.cart.push({
                    ...payload.item,
                    type: payload.selectedType,
                    amount: 1
                });
            }
         console.log(payload)
        },

        deleteFromCart : (state, {payload}) => {
          const index = state.cart.findIndex( (item ) =>item.id == payload.id && item.type == payload.type );
          
          if (state.cart[index].amount > 1) {
            //* Miktar 1'den fazla ise miktarı azalt
            state.cart[index].amount--;
          }else {
            //* Miktar 1'e eşitse ürünü kaldır
            state.cart.splice(index, 1);
          }
        },

        createOrder: (state) => {
            state.cart = [];
        },
    }
})


export const { addToCart, deleteFromCart, createOrder} = cartSlice.actions;
export default cartSlice.reducer;

