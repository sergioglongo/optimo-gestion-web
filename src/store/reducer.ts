import { combineReducers } from 'redux';

// reducer import
import menu from './slices/menu';
import auth from './slices/auth';
import customer from './slices/customer';
import config from './slices/config';
import consorcio from './slices/consorcio'; // Added this line

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  menu,
  auth,
  customer,
  config,
  consorcio // Added this line
});

export default reducer;
