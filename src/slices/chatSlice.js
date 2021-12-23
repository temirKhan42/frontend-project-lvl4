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
    return {};
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
  name: 'channel',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
      state.currentChannelId = action.payload.id;
    },
    renameChannel: (state, action) => {
      const newChannel = action.payload;
      state.channels = state.channels.map((channel) => {
        if (channel.id === newChannel.id) {
          return newChannel;
        }
        return channel;
      });
    },
    removeChannel: (state, action) => {
      const removingId = action.payload;
      if (removingId === state.currentChannelId) {
        state.currentChannelId = defaultChannelId;
      }
      state.channels = state.channels.filter(({ id }) => id !== removingId);
      state.messages = state.messages.filter(({ channelId }) => channelId !== removingId);
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      state.channels = action.payload.channels;
      state.currentChannelId = action.payload.currentChannelId;
      state.messages = action.payload.messages;
    });
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
