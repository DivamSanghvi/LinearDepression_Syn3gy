import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "Introduction to Machine Learning",
  topics: [
    { title: "Introduction", timestamp: 45 },
    { title: "Supervised Learning", timestamp: 180 },
    { title: "Feature Extraction", timestamp: 320 },
    { title: "Model Training", timestamp: 450 },
  ],
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseTitle: (state, action) => {
      state.title = action.payload;
    },
    setTopics: (state, action) => {
      state.topics = action.payload;
    },
  },
});

export const { setCourseTitle, setTopics } = courseSlice.actions;
export default courseSlice.reducer;
