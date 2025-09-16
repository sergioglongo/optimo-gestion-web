import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Consorcio } from 'types/consorcio'; // Asumo que este tipo ya existe

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
      // Seleccionar el primer consorcio por defecto si la lista no está vacía
      if (action.payload.length > 0) {
        state.selectedConsorcio = action.payload[0];
      } else {
        state.selectedConsorcio = null;
      }
    },
    selectConsorcio(state, action: PayloadAction<string | number>) {
      const consorcioId = String(action.payload);
      state.selectedConsorcio = state.consorciosList.find((consorcio) => String(consorcio.id) === consorcioId) || null;
    },
    clearConsorcios(state) {
      state.consorciosList = [];
      state.selectedConsorcio = null;
    }
  }
});

export const { setConsorcios, selectConsorcio, clearConsorcios } = consorcioSlice.actions;

export default consorcioSlice.reducer;
