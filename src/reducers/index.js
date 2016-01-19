import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import welcome from './welcome';
import user from './user';
import organizations from './organizations';
import productions from './productions';
import distributions from './distributions';
import configs from './configs';
import drafts from './drafts';
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
  productions,
  libraries: (state = {}, action) => state,
  drafts,
  distributions,
  configs,
});
