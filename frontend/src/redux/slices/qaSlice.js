import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const qaSlice = createSlice({
  name: "qa",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = qaSlice.actions;
export default qaSlice.reducer;
