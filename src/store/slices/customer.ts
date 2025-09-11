import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface CustomerState {
  open: boolean;
  customerId: number | null;
}

// Define the initial state using that type
const initialState: CustomerState = {
  open: false,
  customerId: null
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    openCustomerModal: (state, action: PayloadAction<number | undefined>) => {
      state.open = true;
      state.customerId = action.payload || null; // Si no hay ID, es para añadir uno nuevo
    },
    closeCustomerModal: (state) => {
      state.open = false;
      state.customerId = null;
    }
  }
});

export const { openCustomerModal, closeCustomerModal } = customerSlice.actions;

export default customerSlice.reducer;
