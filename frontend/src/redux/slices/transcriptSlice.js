import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transcript: "",
};

const transcriptSlice = createSlice({
  name: "transcript",
  initialState,
  reducers: {
    setTranscript: (state, action) => {
      state.transcript = action.payload;
    },
  },
});

export const { setTranscript } = transcriptSlice.actions;
export default transcriptSlice.reducer;
