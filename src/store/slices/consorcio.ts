import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Consorcio } from 'types/consorcio';

// project import
import { logout } from './auth';

interface ConsorcioState {
  consorciosList: Consorcio[];
  selectedConsorcio: Consorcio | null;
}

const initialState: ConsorcioState = {
  consorciosList: [],
  selectedConsorcio: null
};

const consorcioSlice = createSlice({
  name: 'consorcio',
  initialState,
  reducers: {
    setConsorcios(state, action: PayloadAction<Consorcio[]>) {
      state.consorciosList = action.payload;
      // Auto-seleccionar el primer consorcio de la lista si existe
      if (action.payload && action.payload.length > 0) {
        state.selectedConsorcio = action.payload[0];
      } else {
        // Si la lista está vacía, asegurarse de que no haya ninguno seleccionado
        state.selectedConsorcio = null;
      }
    },
    selectConsorcio(state, action: PayloadAction<string | number>) {
      const consorcioId = action.payload;
      state.selectedConsorcio = state.consorciosList.find((c) => c.id === consorcioId) || null;
    },
    setSelectedConsorcio(state, action: PayloadAction<Consorcio>) {
      state.selectedConsorcio = action.payload;
      // También actualizamos la lista para mantener la consistencia
      const index = state.consorciosList.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.consorciosList[index] = action.payload;
      }
    },
    clearConsorcios(state) {
      state.consorciosList = [];
      state.selectedConsorcio = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.consorciosList = [];
      state.selectedConsorcio = null;
    });
  }
});

export const { setConsorcios, selectConsorcio, setSelectedConsorcio, clearConsorcios } = consorcioSlice.actions;

export default consorcioSlice.reducer;
