import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../slices/chatSlice.js';

const store = configureStore({
  reducer: {
    channel: chatReducer,
  },
});

export default store;
