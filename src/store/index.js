import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../slices/chatSlice.js';
import uiReducer from '../slices/uiSlice.js';

const store = configureStore({
  reducer: {
    chat: chatReducer,
    ui: uiReducer,
  },
});

export default store;
