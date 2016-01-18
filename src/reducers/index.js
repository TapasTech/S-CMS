import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import welcome from './welcome';
import user from './user';
import organizations from './organizations';
import Flux from '#/utils/redux-rest';
import { path } from '#/utils/params';

const myAPI = {
  categories: ({orgId, productId} = path()) => `/organizations/${orgId}/products/${productId}/categories`,
  articles: ({orgId, productId, categoryId} = path()) => `/organizations/${orgId}/products/${productId}/categories/${categoryId}/articles`
}

export const flux = new Flux(myAPI);

export default combineReducers({
  ...flux.reducers,
  router: routerStateReducer,
  welcome,
  user,
  organizations,
  productions: (state = {}, action) => state,
  libraries: (state = {}, action) => state,
  drafts: (state = {}, action) => state,
  configs: (state = {}, action) => state
});
