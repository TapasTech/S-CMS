import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import welcome from './welcome';
import user from './user';
import organizations from './organizations';
import productions from './productions';
import distributions from './distributions';
import configs from './configs';

export default combineReducers({
  router: routerStateReducer,
  welcome,
  user,
  organizations,
  productions,
  libraries: (state = {}, action) => state,
  drafts: (state = {}, action) => state,
  distributions,
  configs,
});