import { createSlice } from "@reduxjs/toolkit";

export const avSlice = createSlice({
  name: "av",
  initialState: [
    {
      img: "https://unsplash.com/photos/black-and-white-benq-projector-EEnJpGHkU4k",
      name: "Projectors",
      cost: 200,
      quantity: 0,
    },
    {
      img: "https://unsplash.com/photos/black-and-brown-bookshelf-speaker-on-black-surface-u8-QI4tRES0",
      name: "Speaker",
      cost: 35,
      quantity: 0,
    },
    {
      img: "https://unsplash.com/photos/black-and-gray-corded-microphone-hvgd0ygXuQQ",
      name: "Microphone",
      cost: 45,
      quantity: 0,
    },
    {
      img: "https://unsplash.com/photos/a-white-board-sitting-on-top-of-a-wooden-floor-FYFKBiWLq88",
      name: "Whiteboards",
      cost: 80,
      quantity: 0,
    },
    {
      img: "https://unsplash.com/photos/text-pAoOSyIHoNA",
      name: "signage",
      cost: 80,
      quantity: 0,
    },
  ],


  reducers: {
    incrementAvQuantity: (state, action) => {
      const item = state[action.payload];
      if (item) {
        item.quantity++;
      }
    },
    decrementAvQuantity: (state, action) => {
      const item = state[action.payload];
      if (item && item.quantity > 0) {
        item.quantity--;
      } 
    },
  },
});

export const { incrementAvQuantity, decrementAvQuantity } = avSlice.actions;

export default avSlice.reducer;
