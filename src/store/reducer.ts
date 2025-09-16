import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// reducer import
import menu from './slices/menu';
import auth from './slices/auth';
import customer from './slices/customer';
import config from './slices/config';
import consorcio from './slices/consorcio';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  menu,
  auth,
  customer,
  config,
  consorcio
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'consorcio']
};

export default persistReducer(persistConfig, reducer);
