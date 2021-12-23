import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import routes from '../routes.js';

const notify = () => toast.error('Ошибка соединения');

async function fetchData(token) {
  try {
    const response = await axios({
      method: 'get',
      url: routes.dataPath(),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    if (err.response.status === 500) {
      notify();
    }
    throw err;
  }
}

const defaultChannelId = 1;

const initialState = {
  channels: [], // [{ id: 1, name: '', removable: true }, {}, {}]
  currentChannelId: 1,
  messages: [], // [{ channelId: 1, id: 1, userName: '', body: '' }, {}, {}]
};

export const fetchChannels = createAsyncThunk(
  'channels/fetchStatus',
  async () => {
    const userId = localStorage.getItem('userId');
    const { token } = JSON.parse(userId);
    const response = await fetchData(token);
    return response.data;
  },
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => ({
      ...state,
      currentChannelId: action.payload,
    }),
    addChannel: (state, action) => ({
      ...state,
      channels: [...state.channels, action.payload],
      currentChannelId: action.payload.id,
    }),
    renameChannel: (state, action) => {
      const newChannel = action.payload;
      const newChannels = state.channels.map((channel) => {
        if (channel.id === newChannel.id) {
          return newChannel;
        }
        return channel;
      });

      return {
        ...state,
        channels: newChannels,
      };
    },
    removeChannel: (state, action) => {
      const removingId = action.payload;

      const currentChannelId = removingId === state.currentChannelId
        ? defaultChannelId
        : state.currentChannelId;

      const newChannels = state.channels
        .filter(({ id }) => id !== removingId);

      const newMessages = state.messages
        .filter(({ channelId }) => channelId !== removingId);

      return {
        channels: newChannels,
        messages: newMessages,
        currentChannelId,
      };
    },
    addMessage: (state, action) => ({
      ...state,
      messages: [...state.messages, action.payload],
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, action) => ({
      channels: action.payload.channels,
      currentChannelId: action.payload.currentChannelId,
      messages: action.payload.messages,
    }));
  },
});

export const {
  setCurrentChannel,
  addChannel,
  renameChannel,
  removeChannel,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
