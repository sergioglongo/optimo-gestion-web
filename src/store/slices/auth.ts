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
      state.user = user;
      state.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },

    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    initialize(state, action) {
      const { isLoggedIn, user, token } = action.payload;
      state.isLoggedIn = isLoggedIn;
      state.isInitialized = true;
      state.user = user;
      state.token = token;
    }
  }
});

export default auth.reducer;

export const { login, logout, initialize } = auth.actions;
