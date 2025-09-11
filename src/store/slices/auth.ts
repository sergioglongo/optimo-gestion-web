// third-party
import { createSlice } from '@reduxjs/toolkit';

// types
import { AuthProps } from 'types/auth';

// initial state
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  token: null
};

// ==============================|| SLICE - AUTH ||============================== //

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { user, token } = action.payload;
      state.isLoggedIn = true;
      state.isInitialized = true;
      state.user = user;
      state.token = token;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.isInitialized = true;
      state.user = null;
      state.token = null;
    }
  }
});

export default auth.reducer;

export const { login, logout } = auth.actions;
