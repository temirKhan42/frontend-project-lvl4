import { createSlice } from '@reduxjs/toolkit';

const defaultId = 0;

const initialState = {
  modals: [
    { id: 1, name: 'addChannel', state: 'close' }, // state: open/close
    { id: 2, name: 'removeChannel', state: 'close' },
    { id: 3, name: 'renameChannel', state: 'close' },
  ],
  currentModalId: defaultId,
  isAnyModalOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const modalName = action.payload;

      const modal = state.modals.find(({ name }) => name === modalName);

      const newModals = state.modals
        .filter(({ id }) => id !== modal.id)
        .map((closeModal) => ({ ...closeModal, state: 'close' }));

      return {
        modals: [...newModals, { ...modal, state: 'open' }],
        currentModalId: modal.id,
        isAnyModalOpen: true,
      };
    },
    closeModal: (state, action) => {
      const modalName = action.payload;

      const modal = state.modals.find(({ name }) => name === modalName);

      const newModals = state.modals.filter(({ id }) => id !== modal.id);

      const currentModalId = state.currentModalId === modal.id
        ? defaultId
        : state.currentModalId;

      return {
        modals: [...newModals, { ...modal, state: 'close' }],
        currentModalId,
        isAnyModalOpen: currentModalId !== defaultId,
      };
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;

export default uiSlice.reducer;
