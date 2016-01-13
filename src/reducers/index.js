import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import welcome from './welcome';

export default combineReducers({
  router: routerStateReducer,
  welcome
});