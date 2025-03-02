import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./slices/videoSlice";
import courseReducer from "./slices/courseSlice";
import transcriptReducer from "./slices/transcriptSlice";
import qaReducer from "./slices/qaSlice";

const store = configureStore({
  reducer: {
    video: videoReducer,
    course: courseReducer,
    transcript: transcriptReducer,
    qa: qaReducer,
  },
});

export default store;
