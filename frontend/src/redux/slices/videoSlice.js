import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoSrc: "",
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoSrc: (state, action) => {
      state.videoSrc = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setPlaybackRate: (state, action) => {
      state.playbackRate = action.payload;
    },
  },
});

export const {
  setVideoSrc,
  togglePlay,
  setVolume,
  toggleMute,
  setCurrentTime,
  setDuration,
  setPlaybackRate,
} = videoSlice.actions;

export default videoSlice.reducer;
