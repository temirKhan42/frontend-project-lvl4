import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import fetchData from '../../js/fetchData.js';

const initialState = {
  channels: [],         // [{ id: 1, name: '', removable: true }, {}, {}]
  currentChannelId: 1,
  messages: [],         // [{ channelId: 1, id: 1, userName: '', text: '' }, {}, {}]
};

export const fetchChannels = createAsyncThunk(
  'channels/fetchStatus',
  async (thunkAPI) => {
    const userId = localStorage.getItem('userId');
    const { token } = JSON.parse(userId);
    const response = await fetchData(token);
    return response.data;
  }
)

export const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      console.log(action.payload);
      state.channels.push(action.payload);
      state.currentChannelId = action.payload.id;
    },
    renameChannel: (state, action) => {
      const newChannel = action.payload;
      console.log(action.payload);
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
        state.currentChannelId = 1;
      }
      state.channels = state.channels.filter(({ id }) => id !== removingId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      console.log(state, action);
      state.channels = action.payload.channels;
      state.currentChannelId = action.payload.currentChannelId;
      state.messages = action.payload.messages;
    });
  }
});

export const { 
  setCurrentChannel, 
  addChannel, 
  renameChannel, 
  removeChannel,
} = channelSlice.actions;

export default channelSlice.reducer;
