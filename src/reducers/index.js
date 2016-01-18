import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import welcome from './welcome';
import user from './user';
import organizations from './organizations';
import distributions from './distributions';
import configs from './configs';

export default combineReducers({
  router: routerStateReducer,
  welcome,
  user,
  organizations,
  productions: (state = {}, action) => state,
  libraries: (state = {}, action) => state,
  drafts: (state = {}, action) => state,
  distributions,
  configs,
});