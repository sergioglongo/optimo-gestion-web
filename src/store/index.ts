import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducer
});

const { dispatch } = store;

// Infiere los tipos `RootState` y `AppDispatch` desde la store misma
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, dispatch };
