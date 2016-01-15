import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import welcome from './welcome';
import user from './user';
import organizations from './organizations';

export default combineReducers({
  router: routerStateReducer,
  welcome,
  user,
  organizations,
  productions: (state = {}, action) => state,
  libraries: (state = {}, action) => state,
  drafts: (state = {}, action) => state,
  distributions: (state = {}, action) => state,
  configs: (state = {}, action) => state,
});