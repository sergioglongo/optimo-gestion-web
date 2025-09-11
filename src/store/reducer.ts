import { combineReducers } from 'redux';

// reducer import
import menu from './slices/menu';
import auth from './slices/auth';
import customer from './slices/customer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  menu,
  auth,
  customer
});

export default reducer;
